"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type Props = {
  currentImageUrl?: string;
  onCroppedFile: (file: File) => void;
  label?: string;
};

export default function ImageCropUpload({
  currentImageUrl,
  onCroppedFile,
  label = "Upload & Crop",
}: Props) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const nextCrop = centerCrop(
      makeAspectCrop({ unit: "%", width: 70 }, 1, width, height),
      width,
      height
    );
    setCrop(nextCrop);
  };

  const getCroppedBlob = useCallback(async (): Promise<Blob | null> => {
    if (!imgRef.current || !completedCrop) return null;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.max(1, Math.floor(completedCrop.width * scaleX));
    canvas.height = Math.max(1, Math.floor(completedCrop.height * scaleY));

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  }, [completedCrop]);

  const onPickImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const applyCroppedImage = async () => {
    const blob = await getCroppedBlob();
    if (!blob) return;

    const file = new File([blob], `profile-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    onCroppedFile(file);
    setShowCropModal(false);
    setImgSrc("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[rgba(240,236,228,0.12)]">
          <img
            src={currentImageUrl || "https://placehold.co/200x200?text=User"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickImage}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-lg border border-[rgba(240,236,228,0.18)] text-sm text-[#f0ece4] hover:bg-[rgba(240,236,228,0.08)]"
        >
          {label}
        </button>
      </div>

      {showCropModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCropModal(false)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-[rgba(240,236,228,0.12)] bg-[#121212] p-5">
            <h3 className="text-[#f0ece4] text-lg mb-4">Crop profile image</h3>

            <div className="max-h-[60vh] overflow-auto rounded-lg">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(nextCrop) => setCrop(nextCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop source"
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 rounded-lg border border-[rgba(240,236,228,0.18)] text-[rgba(240,236,228,0.8)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCroppedImage}
                className="px-4 py-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}