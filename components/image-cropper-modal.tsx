"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedFile: File) => void;
  imageFile: File | null;
  type: "header" | "footer";
  letterheadName: string;
}

// Microsoft Word-like aspect ratios
const HEADER_ASPECT_RATIO = 16 / 3; // Wide header
const FOOTER_ASPECT_RATIO = 16 / 2; // Slightly taller footer

export function ImageCropperModal({
  isOpen,
  onClose,
  onSave,
  imageFile,
  type,
  letterheadName,
}: ImageCropperModalProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio =
    type === "header" ? HEADER_ASPECT_RATIO : FOOTER_ASPECT_RATIO;

  // Load image when file changes
  React.useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result?.toString() || "");
    });
    reader.readAsDataURL(imageFile);

    return () => {
      reader.abort();
    };
  }, [imageFile]);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  }, [isOpen]);

  // Set initial crop when image loads
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;

      // Make a centered crop with the specified aspect ratio
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          aspectRatio,
          width,
          height
        ),
        width,
        height
      );

      setCrop(initialCrop);
    },
    [aspectRatio]
  );

  // Generate preview canvas when crop changes
  React.useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio;

    // Set canvas width to crop width and account for device pixel ratio
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    // Scale canvas context for retina/hidpi displays
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped image
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop]);

  // Handle save button click
  const handleSave = useCallback(() => {
    if (!previewCanvasRef.current) {
      return;
    }

    previewCanvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `${type}-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onSave(file);
        onClose();
      },
      "image/jpeg",
      0.9
    );
  }, [onSave, onClose, type]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Crop {type === "header" ? "Header" : "Footer"} - {letterheadName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Crop the {type} section with {type === "header" ? "16:3" : "16:2"}{" "}
            aspect ratio (Microsoft Word style)
          </div>

          {/* Main cropper */}
          {imageSrc && (
            <div className="flex flex-col items-center space-y-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minHeight={50}
                className="max-h-[400px] max-w-full border border-gray-200 rounded"
              >
                <img
                  ref={imgRef}
                  alt={`Crop ${type}`}
                  src={imageSrc || "/placeholder.svg"}
                  style={{ maxHeight: "400px" }}
                  onLoad={onImageLoad}
                  className="max-w-full h-auto"
                />
              </ReactCrop>

              {/* Preview section */}
              {completedCrop && (
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div className="border border-gray-200 rounded p-2 bg-gray-50">
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: completedCrop.width,
                        height: completedCrop.height,
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            Save {type === "header" ? "Header" : "Footer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
