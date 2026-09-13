
import base64
import io
import json

import numpy as np
import torch
import torch.nn.functional as F
import timm
import torchvision.transforms as T

from huggingface_hub import hf_hub_download
from safetensors.torch import load_file
from PIL import Image


MODEL_REPO = "vyshnav112233/diabetic-retinopathy-efficientnet-b5"


class DRModel:
    def __init__(self):
        self.device = torch.device("cpu")

        print("Downloading/loading model configuration...")

        config_path = hf_hub_download(
            repo_id=MODEL_REPO,
            filename="config.json"
        )

        weights_path = hf_hub_download(
            repo_id=MODEL_REPO,
            filename="model.safetensors"
        )

        with open(config_path, "r") as f:
            config = json.load(f)

        self.config = config

        print("Creating EfficientNet-B5 model...")

        self.model = timm.create_model(
            config["model_name"],
            pretrained=False,
            num_classes=config["regression_output_dim"]
        )

        self.model.load_state_dict(
            load_file(weights_path, device="cpu")
        )

        self.model.to(self.device)
        self.model.eval()

        self.transform = T.Compose([
            T.Resize((config["img_size"], config["img_size"])),
            T.ToTensor(),
            T.Normalize(
                mean=config["imagenet_mean"],
                std=config["imagenet_std"]
            ),
        ])

        # ---------------------------------------------------------
        # Find the final convolutional layer automatically.
        #
        # Grad-CAM needs the activations and gradients from a
        # convolutional feature layer. We search through the model
        # and use the last Conv2d layer.
        # ---------------------------------------------------------

        self.target_layer = None
        self.target_layer_name = None

        for name, module in self.model.named_modules():
            if isinstance(module, torch.nn.Conv2d):
                self.target_layer = module
                self.target_layer_name = name

        if self.target_layer is None:
            raise RuntimeError(
                "Could not find a convolutional layer for Grad-CAM."
            )

        print(
            f"Grad-CAM target layer: {self.target_layer_name}"
        )

        print("Model loaded successfully.")

    # -------------------------------------------------------------
    # Grad-CAM
    # -------------------------------------------------------------

    def generate_gradcam(self, tensor):
        """
        Generate a Grad-CAM heatmap from the actual model.

        The heatmap is based on the gradients of the model output
        with respect to the final convolutional feature maps.
        """

        activations = []
        gradients = []

        def forward_hook(module, inputs, output):
            activations.append(output)

        def backward_hook(module, grad_input, grad_output):
            if grad_output and grad_output[0] is not None:
                gradients.append(grad_output[0])

        forward_handle = self.target_layer.register_forward_hook(
            forward_hook
        )

        backward_handle = self.target_layer.register_full_backward_hook(
            backward_hook
        )

        try:
            # We need gradients for Grad-CAM.
            self.model.zero_grad(set_to_none=True)

            output = self.model(tensor)

            # The model produces an ordinal regression score.
            score = output.squeeze()

            # Backpropagate from the actual model score.
            score.backward()

            if not activations:
                raise RuntimeError(
                    "Grad-CAM activation was not captured."
                )

            if not gradients:
                raise RuntimeError(
                    "Grad-CAM gradient was not captured."
                )

            activation = activations[0]
            gradient = gradients[0]

            # Expected shape:
            # [batch, channels, height, width]
            if activation.ndim != 4 or gradient.ndim != 4:
                raise RuntimeError(
                    "Grad-CAM requires a 4D convolutional feature map."
                )

            # Global-average-pool gradients over spatial dimensions.
            weights = gradient.mean(
                dim=(2, 3),
                keepdim=True
            )

            # Weighted combination of feature maps.
            cam = (weights * activation).sum(
                dim=1,
                keepdim=True
            )

            # ReLU keeps only positive influence.
            cam = F.relu(cam)

            # Resize to the original model input resolution.
            cam = F.interpolate(
                cam,
                size=(tensor.shape[2], tensor.shape[3]),
                mode="bilinear",
                align_corners=False
            )

            cam = cam.squeeze(0).squeeze(0)

            # Normalize safely.
            cam_min = cam.min()
            cam_max = cam.max()

            if float(cam_max - cam_min) > 1e-8:
                cam = (cam - cam_min) / (
                    cam_max - cam_min
                )
            else:
                cam = torch.zeros_like(cam)

            heatmap = (
                cam.detach()
                .cpu()
                .numpy()
                .astype(np.float32)
            )

            return heatmap

        finally:
            forward_handle.remove()
            backward_handle.remove()

    # -------------------------------------------------------------
    # Convert heatmap to a frontend-friendly base64 PNG.
    # -------------------------------------------------------------

    def heatmap_to_base64(self, heatmap):
        """
        Convert normalized Grad-CAM values into a transparent
        red/yellow-style heatmap PNG encoded as base64.

        This is generated from the actual model's Grad-CAM output.
        """

        heatmap_uint8 = np.clip(
            heatmap * 255.0,
            0,
            255
        ).astype(np.uint8)

        heatmap_image = Image.fromarray(
            heatmap_uint8,
            mode="L"
        )

        # Use a simple RGB representation.
        # The frontend can apply its own visual blending.
        heatmap_rgb = Image.merge(
            "RGB",
            (
                heatmap_image,
                Image.fromarray(
                    np.zeros_like(heatmap_uint8),
                    mode="L"
                ),
                Image.fromarray(
                    np.zeros_like(heatmap_uint8),
                    mode="L"
                ),
            )
        )

        buffer = io.BytesIO()

        heatmap_rgb.save(
            buffer,
            format="PNG"
        )

        encoded = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return encoded

    # -------------------------------------------------------------
    # Prediction
    # -------------------------------------------------------------

    def predict(self, image: Image.Image):
        image = image.convert("RGB")

        tensor = self.transform(image)
        tensor = tensor.unsqueeze(0)
        tensor = tensor.to(self.device)

        # ---------------------------------------------------------
        # Generate the normal prediction AND real Grad-CAM.
        # ---------------------------------------------------------

        heatmap = self.generate_gradcam(tensor)

        # Run a clean prediction again for the final result.
        self.model.zero_grad(set_to_none=True)

        with torch.no_grad():
            output = self.model(tensor)
            score = float(
                output.squeeze(-1).cpu().item()
            )

        # ---------------------------------------------------------
        # Convert ordinal regression score into DR class.
        # ---------------------------------------------------------

        prediction_class = 0

        for threshold in self.config["thresholds"]:
            prediction_class += (
                float(score) > float(threshold)
            )

        prediction_class = int(
            np.clip(
                prediction_class,
                0,
                len(self.config["thresholds"])
            )
        )

        label = self.config["label_names"][
            str(prediction_class)
        ]

        # Convert the Grad-CAM heatmap to base64 PNG.
        heatmap_base64 = self.heatmap_to_base64(
            heatmap
        )

        return {
            "prediction": label,
            "class_id": prediction_class,
            "score": score,
            "thresholds": self.config["thresholds"],

            # -----------------------------------------------------
            # NEW: real Grad-CAM information
            # -----------------------------------------------------

            "explainability": {
                "method": "Grad-CAM",
                "target_layer": self.target_layer_name,
                "heatmap": heatmap_base64,
                "heatmap_width": int(heatmap.shape[1]),
                "heatmap_height": int(heatmap.shape[0]),
            }
        }

