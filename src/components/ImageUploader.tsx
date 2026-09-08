import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Camera, 
  FileUp,
  Sparkles,
  RefreshCw,
  Eye
} from 'lucide-react';
import { Language, ImageQualityStatus } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_FUNDUS_IMAGES } from '../assets/sampleImages';

interface ImageUploaderProps {
  imageSrc: string | null;
  fileName: string;
  fileSizeText: string;
  uploadProgress: number;
  imageQuality: ImageQualityStatus;
  onImageSelected: (src: string, name: string, sizeText: string, quality: ImageQualityStatus) => void;
  onImageRemoved: () => void;
  lang: Language;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageSrc,
  fileName,
  fileSizeText,
  uploadProgress,
  imageQuality,
  onImageSelected,
  onImageRemoved,
  lang,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      // Automated image quality heuristic for uploaded image
      const quality: ImageQualityStatus = file.name.toLowerCase().includes('poor') || file.name.toLowerCase().includes('blur')
        ? 'POOR'
        : 'GOOD';
      onImageSelected(result, file.name, sizeInMB, quality);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (presetKey: 'normal' | 'moderate' | 'poorQuality') => {
    if (presetKey === 'normal') {
      onImageSelected(
        SAMPLE_FUNDUS_IMAGES.normal,
        'fundus_normal_macula_clear.jpg',
        '2.4 MB',
        'GOOD'
      );
    } else if (presetKey === 'moderate') {
      onImageSelected(
        SAMPLE_FUNDUS_IMAGES.moderate,
        'fundus_diabetic_microvascular_changes.jpg',
        '3.1 MB',
        'GOOD'
      );
    } else {
      onImageSelected(
        SAMPLE_FUNDUS_IMAGES.poorQuality,
        'fundus_underexposed_blurry_artifact.jpg',
        '1.8 MB',
        'POOR'
      );
    }
  };

  return (
    <div id="fundus-image-upload-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-700" />
            <span>{t.uploadFundusImage}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.supportedFormats}
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id="fundus-file-input"
        accept="image/jpeg, image/jpg, image/png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {!imageSrc ? (
        <div className="space-y-4">
          {/* Drag & Drop Box */}
          <div
            id="fundus-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-teal-600 bg-teal-50/60'
                : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50'
            }`}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-1">
              {t.dragDropText}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Works with standard fundus camera outputs (Topcon, Zeiss, Remidio Fundus on phone, Forus 3nethra).
            </p>

            <button
              type="button"
              id="browse-fundus-files-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.browseFiles}
            </button>
          </div>

          {/* Clinical Demo Presets Quick Selector */}
          <div className="pt-3">
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{t.orUsePreset}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                id="preset-fundus-normal"
                onClick={() => handlePresetSelect('normal')}
                className="p-3 text-left border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 rounded-xl transition-all cursor-pointer group bg-slate-50/60"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                    Normal Retina
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Clean macula & vessel branches. Good quality.
                </p>
              </button>

              <button
                type="button"
                id="preset-fundus-moderate"
                onClick={() => handlePresetSelect('moderate')}
                className="p-3 text-left border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 rounded-xl transition-all cursor-pointer group bg-slate-50/60"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-900">
                    Moderate DR Suspected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Microaneurysms & exudates. Benchmark screening.
                </p>
              </button>

              <button
                type="button"
                id="preset-fundus-poor"
                onClick={() => handlePresetSelect('poorQuality')}
                className="p-3 text-left border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 rounded-xl transition-all cursor-pointer group bg-slate-50/60"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-950">
                    Poor Image Quality
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Lens blur & optical glare artifact. Re-shoot trigger.
                </p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview Area */
        <div id="fundus-preview-area" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-900 text-white rounded-2xl">
            <div className="relative w-44 h-44 shrink-0 rounded-xl overflow-hidden bg-black flex items-center justify-center border-2 border-slate-700 shadow-md">
              <img
                src={imageSrc}
                alt="Fundus scan preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 left-2 bg-slate-950/80 text-[10px] text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                Retina Frame 45°
              </span>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-white truncate max-w-xs">
                    {fileName}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                    {fileSizeText}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standard 45-degree posterior pole field centered between disc & macula.
                </p>
              </div>

              {/* Upload Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Image Buffer Ingestion</span>
                  <span className="font-mono text-teal-400">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  id="replace-fundus-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.removeImage}</span>
                </button>

                <button
                  type="button"
                  id="remove-fundus-image-btn"
                  onClick={onImageRemoved}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium rounded-lg border border-rose-800/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
