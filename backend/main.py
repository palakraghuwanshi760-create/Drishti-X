from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from io import BytesIO

from dr_model import DRModel


app = FastAPI(title="NetraRakshak AI API")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        "http://localhost:3001",
        "http://127.0.0.1:3001",

        "http://localhost:3002",
        "http://127.0.0.1:3002",

        "http://localhost:3003",
        "http://127.0.0.1:3003",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load AI Model
# --------------------------------------------------

print("Loading diabetic retinopathy AI model...")

model = DRModel()

print("DR model loaded successfully!")


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "service": "NetraRakshak AI Backend",
        "status": "running"
    }


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "loaded",
        "service": "NetraRakshak AI Backend"
    }


# --------------------------------------------------
# Prediction
# --------------------------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Check that a file was received
    if file is None:
        raise HTTPException(
            status_code=400,
            detail="No image file received."
        )

    print("----------------------------------------")
    print("Prediction request received")
    print("Filename:", file.filename)
    print("Content type:", file.content_type)

    # --------------------------------------------------
    # Validate MIME type
    # --------------------------------------------------

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported image type: {file.content_type}. "
                "Please send a JPG, JPEG, PNG, or WEBP image."
            )
        )

    try:

        # --------------------------------------------------
        # Read uploaded bytes
        # --------------------------------------------------

        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded image is empty."
            )

        print("Received bytes:", len(contents))

        # --------------------------------------------------
        # Convert bytes → PIL image
        # --------------------------------------------------

        try:
            image = Image.open(BytesIO(contents))

            # Force PIL to actually decode the image
            image.load()

            print("PIL format:", image.format)
            print("Original size:", image.size)

            image = image.convert("RGB")

        except UnidentifiedImageError:
            raise HTTPException(
                status_code=400,
                detail=(
                    "The uploaded file is not a valid JPG, PNG, "
                    "or WEBP image. The frontend may be sending "
                    "an unsupported image format."
                )
            )

        # --------------------------------------------------
        # Run AI model
        # --------------------------------------------------

        print("Running diabetic retinopathy model...")

        result = model.predict(image)

        print("Prediction completed.")
        print("Prediction:", result.get("prediction"))
        print("Class ID:", result.get("class_id"))

        # --------------------------------------------------
        # Return result
        # --------------------------------------------------

        return {
            "success": True,
            "filename": file.filename,
            "image_size": {
                "width": image.width,
                "height": image.height
            },
            **result
        }

    except HTTPException:
        raise

    except Exception as e:

        print("----------------------------------------")
        print("PREDICTION ERROR")
        print(str(e))
        print("----------------------------------------")

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# --------------------------------------------------
# Run Server
# --------------------------------------------------

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000
    )