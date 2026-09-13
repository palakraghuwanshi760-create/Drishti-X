import React, { useRef, useState } from 'react';

import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
} from 'lucide-react';

import { ImageQualityStatus, Language } from '../types';

interface ImageUploaderProps {
  imageSrc: string | null;
  fileName: string;
  fileSizeText: string;
  uploadProgress: number;
  imageQuality: ImageQualityStatus;

  onImageSelected: (
    src: string,
    name: string,
    sizeText: string,
    quality: ImageQualityStatus,
    issues?: string[]
  ) => void;

  onImageRemoved: () => void;

  lang: Language;

  disabled?: boolean;
}

interface QualityResult {
  quality: ImageQualityStatus;
  issues: string[];
}


/* -------------------------------------------------------------------------- */
/* SYNTHETIC DEMO IMAGES                                                     */
/* -------------------------------------------------------------------------- */
/*
 * These are generated locally for UI demonstration only.
 *
 * IMPORTANT:
 * They are NOT real clinical fundus photographs.
 * They must NOT be used for medical diagnosis or model validation.
 *
 * We generate them as SVG first and then convert them to PNG before sending
 * them to the backend. The backend/PIL can read PNG correctly.
 */
/* -------------------------------------------------------------------------- */

const createDemoFundus = (
  type: 'normal' | 'moderate' | 'poor'
): string => {
  const spots =
    type === 'moderate'
      ? `
        <circle cx="155" cy="125" r="7" fill="#3b0f0f"/>
        <circle cx="180" cy="150" r="5" fill="#4b1111"/>
        <circle cx="205" cy="115" r="6" fill="#3b0f0f"/>
        <circle cx="220" cy="180" r="4" fill="#551515"/>
        <circle cx="145" cy="195" r="5" fill="#4b1111"/>
        <circle cx="250" cy="145" r="5" fill="#3b0f0f"/>
      `
      : '';

  const poorOverlay =
    type === 'poor'
      ? `
        <rect
          x="0"
          y="0"
          width="400"
          height="300"
          fill="#8b8b8b"
          opacity="0.55"
        />

        <ellipse
          cx="200"
          cy="150"
          rx="185"
          ry="130"
          fill="none"
          stroke="#d6d6d6"
          stroke-width="35"
          opacity="0.3"
        />
      `
      : '';

  const label =
    type === 'normal'
      ? 'DEMO • NORMAL'
      : type === 'moderate'
        ? 'DEMO • MODERATE DR'
        : 'DEMO • POOR QUALITY';

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="600"
      viewBox="0 0 400 300"
    >

      <defs>

        <radialGradient id="retina" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#f39b73"/>
          <stop offset="45%" stop-color="#c95b43"/>
          <stop offset="80%" stop-color="#8f302e"/>
          <stop offset="100%" stop-color="#351518"/>
        </radialGradient>

        <radialGradient id="disc" cx="50%" cy="50%">
          <stop offset="0%" stop-color="#ffe1a3"/>
          <stop offset="70%" stop-color="#e5a66a"/>
          <stop offset="100%" stop-color="#b66b48"/>
        </radialGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="5"/>
        </filter>

      </defs>

      <rect
        width="400"
        height="300"
        fill="#080b12"
      />

      <ellipse
        cx="200"
        cy="150"
        rx="178"
        ry="132"
        fill="url(#retina)"
      />

      <!-- optic disc -->
      <ellipse
        cx="280"
        cy="145"
        rx="32"
        ry="38"
        fill="url(#disc)"
        opacity="0.95"
      />

      <!-- vessels -->
      <g
        fill="none"
        stroke="#631e27"
        stroke-width="3"
        stroke-linecap="round"
        opacity="0.8"
      >

        <path
          d="M280 145 C245 135 220 120 185 100 C150 82 120 65 95 58"
        />

        <path
          d="M278 147 C245 158 220 175 185 198 C150 220 120 235 92 244"
        />

        <path
          d="M275 142 C245 115 235 92 225 68"
        />

        <path
          d="M275 152 C245 175 235 200 225 230"
        />

        <path
          d="M270 145 C230 145 190 145 145 145 C115 145 90 150 65 160"
        />

      </g>

      ${spots}

      ${
        type === 'poor'
          ? `
            <ellipse
              cx="200"
              cy="150"
              rx="178"
              ry="132"
              fill="#b8b8b8"
              opacity="0.4"
              filter="url(#blur)"
            />
          `
          : ''
      }

      ${poorOverlay}

      <rect
        x="12"
        y="12"
        width="150"
        height="30"
        rx="8"
        fill="#071018"
        opacity="0.85"
      />

      <text
        x="25"
        y="33"
        fill="white"
        font-family="Arial, sans-serif"
        font-size="13"
        font-weight="600"
      >
        ${label}
      </text>

    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};


/* -------------------------------------------------------------------------- */
/* SVG → PNG CONVERSION                                                      */
/* -------------------------------------------------------------------------- */
/*
 * This is the important fix.
 *
 * The demo images are initially SVG.
 * FastAPI/PIL expects a real raster image such as PNG/JPEG.
 *
 * Therefore:
 *
 * SVG data URL
 *      ↓
 * HTML Image
 *      ↓
 * Canvas
 *      ↓
 * PNG data URL
 *
 * The resulting PNG can safely be sent to the backend.
 */
/* -------------------------------------------------------------------------- */

const svgToPngDataUrl = (
  svgDataUrl: string,
  width = 800,
  height = 600
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');

        if (!context) {
          reject(
            new Error(
              'Unable to create image canvas.'
            )
          );
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        const pngDataUrl =
          canvas.toDataURL(
            'image/png'
          );

        resolve(pngDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    image.onerror = () => {
      reject(
        new Error(
          'Unable to convert demo image to PNG.'
        )
      );
    };

    image.src = svgDataUrl;
  });
};


const SAMPLE_FUNDUS_IMAGES = {
  normal: createDemoFundus('normal'),
  moderate: createDemoFundus('moderate'),
  poorQuality: createDemoFundus('poor'),
};


/* -------------------------------------------------------------------------- */
/* IMAGE QUALITY CHECK                                                        */
/* -------------------------------------------------------------------------- */

const assessImageQuality = (
  image: HTMLImageElement
): QualityResult => {
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  const issues: string[] = [];

  if (width < 500 || height < 375) {
    issues.push(
      'Image resolution is too low for reliable screening.'
    );
  }

  const canvas =
    document.createElement('canvas');

  const sampleWidth = 256;

  const sampleHeight = Math.max(
    1,
    Math.round(
      (height / width) *
        sampleWidth
    )
  );

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;

  const context =
    canvas.getContext('2d');

  if (!context) {
    return {
      quality: 'POOR',
      issues: [
        'Unable to analyse the uploaded image.',
      ],
    };
  }

  context.drawImage(
    image,
    0,
    0,
    sampleWidth,
    sampleHeight
  );

  let imageData: ImageData;

  try {
    imageData =
      context.getImageData(
        0,
        0,
        sampleWidth,
        sampleHeight
      );
  } catch {
    return {
      quality: 'POOR',
      issues: [
        'Unable to analyse the uploaded image.',
      ],
    };
  }

  const pixels =
    imageData.data;

  let brightnessSum = 0;
  let brightnessSquaredSum = 0;

  const totalPixels =
    sampleWidth *
    sampleHeight;

  const grayValues =
    new Float32Array(
      totalPixels
    );

  for (
    let i = 0, pixelIndex = 0;
    i < pixels.length;
    i += 4, pixelIndex++
  ) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const gray =
      0.299 * r +
      0.587 * g +
      0.114 * b;

    grayValues[pixelIndex] =
      gray;

    brightnessSum += gray;

    brightnessSquaredSum +=
      gray * gray;
  }

  const meanBrightness =
    brightnessSum /
    totalPixels;

  const variance =
    brightnessSquaredSum /
      totalPixels -
    meanBrightness *
      meanBrightness;

  const standardDeviation =
    Math.sqrt(
      Math.max(
        variance,
        0
      )
    );

  if (meanBrightness < 35) {
    issues.push(
      'Image appears too dark.'
    );
  }

  if (meanBrightness > 225) {
    issues.push(
      'Image appears too bright.'
    );
  }

  if (standardDeviation < 15) {
    issues.push(
      'Low contrast detected; retinal structures may not be clearly visible.'
    );
  }

  let edgeDifferenceSum = 0;
  let edgeSamples = 0;

  for (
    let y = 0;
    y < sampleHeight - 1;
    y++
  ) {
    for (
      let x = 0;
      x < sampleWidth - 1;
      x++
    ) {
      const currentIndex =
        y * sampleWidth + x;

      const rightIndex =
        currentIndex + 1;

      const bottomIndex =
        currentIndex +
        sampleWidth;

      const horizontalDifference =
        Math.abs(
          grayValues[
            currentIndex
          ] -
            grayValues[
              rightIndex
            ]
        );

      const verticalDifference =
        Math.abs(
          grayValues[
            currentIndex
          ] -
            grayValues[
              bottomIndex
            ]
        );

      edgeDifferenceSum +=
        horizontalDifference +
        verticalDifference;

      edgeSamples += 2;
    }
  }

  const averageEdgeDifference =
    edgeSamples > 0
      ? edgeDifferenceSum /
        edgeSamples
      : 0;

  if (
    averageEdgeDifference <
    2.5
  ) {
    issues.push(
      'Possible focus blur detected.'
    );
  }

  const severeExposure =
    meanBrightness < 30 ||
    meanBrightness > 230;

  const multipleProblems =
    issues.length >= 2;

  const quality: ImageQualityStatus =
    severeExposure ||
    multipleProblems
      ? 'POOR'
      : 'GOOD';

  return {
    quality,
    issues,
  };
};


/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

const ImageUploader: React.FC<
  ImageUploaderProps
> = ({
  imageSrc,
  fileName,
  fileSizeText,
  uploadProgress,
  imageQuality,
  onImageSelected,
  onImageRemoved,
  lang,
  disabled = false,
}) => {
  void uploadProgress;
  void lang;

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [isChecking, setIsChecking] =
    useState(false);

  const [uploadError, setUploadError] =
    useState<string | null>(
      null
    );


  /* ---------------------------------------------------------------------- */
  /* PROCESS REAL IMAGE                                                     */
  /* ---------------------------------------------------------------------- */

  const processImage = (
    file: File
  ) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setUploadError(
        'Please upload a JPG, JPEG, PNG, or WEBP image.'
      );
      return;
    }

    const maxSize =
      15 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {
      setUploadError(
        'Image size must be less than 15 MB.'
      );
      return;
    }

    setIsChecking(true);
    setUploadError(null);

    const reader =
      new FileReader();

    reader.onload = () => {
      const src =
        reader.result as string;

      const image =
        new Image();

      image.onload = () => {
        const qualityResult =
          assessImageQuality(
            image
          );

        const sizeInMB =
          file.size /
          (1024 * 1024);

        const sizeText =
          sizeInMB >= 1
            ? `${sizeInMB.toFixed(
                1
              )} MB`
            : `${Math.round(
                file.size / 1024
              )} KB`;

        onImageSelected(
          src,
          file.name,
          sizeText,
          qualityResult.quality,
          qualityResult.issues
        );

        setIsChecking(false);
      };

      image.onerror = () => {
        setIsChecking(false);

        setUploadError(
          'The image could not be read. Please upload another image.'
        );
      };

      image.src = src;
    };

    reader.onerror = () => {
      setIsChecking(false);

      setUploadError(
        'Unable to read the selected file.'
      );
    };

    reader.readAsDataURL(file);
  };


  /* ---------------------------------------------------------------------- */
  /* FILE SELECT                                                            */
  /* ---------------------------------------------------------------------- */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    processImage(file);

    event.target.value = '';
  };


  /* ---------------------------------------------------------------------- */
  /* OPEN FILE PICKER                                                       */
  /* ---------------------------------------------------------------------- */

  const handleBrowse = () => {
    if (
      disabled ||
      isChecking
    ) {
      return;
    }

    fileInputRef.current?.click();
  };


  /* ---------------------------------------------------------------------- */
  /* DEMO PRESETS                                                           */
  /* ---------------------------------------------------------------------- */

  const handleDemoPreset = async (
    type:
      | 'normal'
      | 'moderate'
      | 'poorQuality'
  ) => {
    setUploadError(null);
    setIsChecking(true);

    try {
      const presetMap = {
        normal: {
          src:
            SAMPLE_FUNDUS_IMAGES.normal,

          name:
            'demo_normal_retina.png',

          quality:
            'GOOD' as ImageQualityStatus,

          issues:
            [] as string[],
        },

        moderate: {
          src:
            SAMPLE_FUNDUS_IMAGES.moderate,

          name:
            'demo_moderate_dr.png',

          quality:
            'GOOD' as ImageQualityStatus,

          issues:
            [] as string[],
        },

        poorQuality: {
          src:
            SAMPLE_FUNDUS_IMAGES.poorQuality,

          name:
            'demo_poor_quality.png',

          quality:
            'POOR' as ImageQualityStatus,

          issues: [
            'Severe lens blur',
            'Optical illumination haze',
          ],
        },
      };

      const preset =
        presetMap[type];

      /*
       * IMPORTANT:
       * Convert the generated SVG into a real PNG.
       */
      const pngDataUrl =
        await svgToPngDataUrl(
          preset.src
        );

      /*
       * Calculate the approximate PNG size.
       * This is only for displaying the demo file size.
       */
      const base64Part =
        pngDataUrl.split(',')[1] ||
        '';

      const byteLength =
        Math.ceil(
          (base64Part.length *
            3) /
            4
        );

      const sizeText =
        `${Math.max(
          1,
          Math.round(
            byteLength / 1024
          )
        )} KB`;

      onImageSelected(
        pngDataUrl,
        preset.name,
        sizeText,
        preset.quality,
        preset.issues
      );

    } catch (error) {
      console.error(
        'Demo image conversion failed:',
        error
      );

      setUploadError(
        'Unable to prepare the demo image. Please try again.'
      );

    } finally {
      setIsChecking(false);
    }
  };


  /* ---------------------------------------------------------------------- */
  /* UI                                                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="space-y-5">

      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={
          handleFileChange
        }
        disabled={
          disabled ||
          isChecking
        }
      />


      {/* Upload area */}

      {!imageSrc ? (

        <div
          onClick={
            handleBrowse
          }
          className={`
            relative overflow-hidden
            rounded-2xl
            border border-dashed
            border-slate-600
            bg-slate-900/50
            p-8
            transition-all
            ${
              disabled ||
              isChecking
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer hover:border-teal-400 hover:bg-slate-900'
            }
          `}
        >

          <div className="flex flex-col items-center justify-center text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10">

              {isChecking ? (

                <RefreshCw className="h-8 w-8 animate-spin text-teal-400" />

              ) : (

                <Upload className="h-8 w-8 text-teal-400" />

              )}

            </div>


            <h3 className="text-lg font-semibold text-white">

              {isChecking
                ? 'Preparing image...'
                : 'Upload Fundus Image'}

            </h3>


            <p className="mt-2 max-w-md text-sm text-slate-400">

              Upload a clear retinal photograph for
              diabetic retinopathy screening.

            </p>


            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-slate-500">

              <span className="rounded-full border border-slate-700 px-3 py-1">
                JPG
              </span>

              <span className="rounded-full border border-slate-700 px-3 py-1">
                PNG
              </span>

              <span className="rounded-full border border-slate-700 px-3 py-1">
                WEBP
              </span>

              <span className="rounded-full border border-slate-700 px-3 py-1">
                Max 15 MB
              </span>

            </div>


            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleBrowse();
              }}
              disabled={
                disabled ||
                isChecking
              }
              className="mt-6 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50"
            >
              Browse Files
            </button>

          </div>

        </div>

      ) : (

        /* Image preview */

        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/70">

          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">

                <Eye className="h-5 w-5 text-teal-400" />

              </div>

              <div>

                <p className="text-sm font-semibold text-white">
                  Fundus Image
                </p>

                <p className="text-xs text-slate-400">
                  {fileName} • {fileSizeText}
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={
                onImageRemoved
              }
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
              title="Remove image"
            >
              <X className="h-5 w-5" />
            </button>

          </div>


          <div className="bg-black/30 p-5">

            <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-black">

              <img
                src={imageSrc}
                alt="Uploaded retinal fundus"
                className="mx-auto max-h-[430px] w-full object-contain"
              />

            </div>

          </div>


          <div className="px-5 pb-5">

            {imageQuality ===
            'GOOD' ? (

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

                <div className="flex items-start gap-3">

                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                  <div>

                    <p className="text-sm font-semibold text-emerald-300">
                      Image quality is good
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-emerald-200/70">
                      The image passed the technical
                      quality check and can proceed
                      to screening.
                    </p>

                  </div>

                </div>

              </div>

            ) : imageQuality ===
              'POOR' ? (

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">

                <div className="flex items-start gap-3">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-amber-300">
                      Image quality needs improvement
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-amber-200/70">
                      Please recapture the retinal
                      image before continuing with
                      AI screening.
                    </p>

                  </div>

                </div>

              </div>

            ) : null}

          </div>

        </div>

      )}


      {/* Upload error */}

      {uploadError && (

        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

          <div className="flex items-start gap-3">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

            <div>

              <p className="text-sm font-semibold text-red-300">
                Upload issue
              </p>

              <p className="mt-1 text-xs leading-relaxed text-red-200/80">
                {uploadError}
              </p>

            </div>

          </div>

        </div>

      )}


      {/* Demo presets */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">

        <div className="mb-4 flex items-center gap-2">

          <ImageIcon className="h-4 w-4 text-teal-400" />

          <div>

            <p className="text-sm font-semibold text-white">
              Demo Images
            </p>

            <p className="text-xs text-slate-500">
              Use these presets to demonstrate
              different screening scenarios.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* Normal */}

          <button
            type="button"
            onClick={() =>
              handleDemoPreset(
                'normal'
              )
            }
            disabled={
              disabled ||
              isChecking
            }
            className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left transition hover:border-teal-500/50 hover:bg-slate-800 disabled:opacity-50"
          >

            <p className="text-sm font-medium text-white">
              Normal Retina
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Good quality
            </p>

          </button>


          {/* Moderate */}

          <button
            type="button"
            onClick={() =>
              handleDemoPreset(
                'moderate'
              )
            }
            disabled={
              disabled ||
              isChecking
            }
            className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left transition hover:border-teal-500/50 hover:bg-slate-800 disabled:opacity-50"
          >

            <p className="text-sm font-medium text-white">
              Moderate DR
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Good quality
            </p>

          </button>


          {/* Poor quality */}

          <button
            type="button"
            onClick={() =>
              handleDemoPreset(
                'poorQuality'
              )
            }
            disabled={
              disabled ||
              isChecking
            }
            className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-left transition hover:border-amber-500/50 hover:bg-slate-800 disabled:opacity-50"
          >

            <p className="text-sm font-medium text-white">
              Poor Quality
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Recapture scenario
            </p>

          </button>

        </div>

      </div>


      {/* Technical note */}

      <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/30 p-4">

        <Eye className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />

        <p className="text-xs leading-relaxed text-slate-500">

          NetraRakshak checks the technical quality
          of the uploaded image before screening.
          Retinal-image validation will be handled
          by the backend AI model rather than a
          browser-based colour heuristic.

        </p>

      </div>

    </div>
  );
};

export default ImageUploader;