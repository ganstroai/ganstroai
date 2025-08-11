"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCropperModal } from "@/components/image-cropper-modal";
import { Upload, Edit, Trash2, Eye, Check, Save } from "lucide-react";
import { toast } from "sonner";
import LoadingButton from "./LoadingButton";
import { API_PUBLIC_URL } from "@/lib/utils/constants";

interface LetterheadComponentProps {
  deletePending: boolean;
  isPending: boolean;
  letterhead: {
    id: string;
    name: string;
    headerImage: string | File | null;
    footerImage: string | File | null;
    uploadDate: Date;
  };
  index: number;
  onUpdate: (
    index: number,
    updates: {
      headerImage?: string | File | null;
      footerImage?: string | File | null;
    },
  ) => void;
  onDelete: (index: number) => void;
  onPreview: (index: number) => void;
  onSelect: (index: number) => void;
  onSave: (index: number) => void;
  isSelected: boolean;
}

export function LetterheadComponent({
  letterhead,
  index,
  onUpdate,
  onDelete,
  onPreview,
  onSelect,
  onSave,
  isSelected,
  isPending,
  deletePending,
}: LetterheadComponentProps) {
  const [cropperModal, setCropperModal] = useState({
    isOpen: false,
    imageFile: null as File | null,
    type: "header" as "header" | "footer",
  });

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "header" | "footer",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input value to allow selecting the same file again
    event.target.value = "";

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file (PNG, JPG, etc.)",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Please upload an image smaller than 10MB",
      });
      return;
    }

    setCropperModal({
      isOpen: true,
      imageFile: file,
      type,
    });
  };

  const handleCropperSave = (croppedFile: File) => {
    const updates =
      cropperModal.type === "header"
        ? { headerImage: croppedFile }
        : { footerImage: croppedFile };

    onUpdate(index, updates);

    toast.success(
      `${cropperModal.type === "header" ? "Header" : "Footer"} saved`,
      {
        description: `${
          cropperModal.type === "header" ? "Header" : "Footer"
        } has been successfully saved.`,
      },
    );

    setCropperModal({
      isOpen: false,
      imageFile: null,
      type: "header",
    });
  };

  const handleDeleteComponent = (type: "header" | "footer") => {
    const updates =
      type === "header" ? { headerImage: null } : { footerImage: null };

    onUpdate(index, updates);

    toast.error(`${type === "header" ? "Header" : "Footer"} deleted`, {
      description: `${
        type === "header" ? "Header" : "Footer"
      } has been removed.`,
    });
  };

  const ComponentBox = ({
    type,
    image,
  }: {
    type: "header" | "footer";
    image: string | File | null;
  }) => (
    <Card className="border-2 border-dashed border-gray-300 transition-colors hover:border-primary/50">
      <CardContent className="p-4">
        <div className="text-center">
          <h4 className="mb-3 text-sm font-medium capitalize">{type}</h4>

          {image ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                <img
                  src={
                    typeof image === "string"
                      ? `${API_PUBLIC_URL}/${image}` || "/placeholder.svg"
                      : URL.createObjectURL(image)
                  }
                  alt={`${type} preview`}
                  className="mx-auto h-auto max-h-24 max-w-full rounded"
                />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => handleFileUpload(e as any, type);
                    input.click();
                  }}
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteComponent(type)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, type)}
                className="hidden"
                id={`${letterhead.id}-${type}-upload`}
              />
              <label
                htmlFor={`${letterhead.id}-${type}-upload`}
                className="cursor-pointer"
              >
                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="mb-1 text-xs text-gray-600">Upload {type}</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Card
        className={`cursor-pointer border-2 transition-all duration-200 ${
          isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect(index)}
      >
        <CardContent className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-medium">{letterhead.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Created on {letterhead.uploadDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              {isSelected && (
                <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-white">
                  Selected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <LoadingButton
                className="min-w-24"
                isLoading={isPending}
                variant="outline"
                size="sm"
                disabled={
                  !(
                    letterhead.name &&
                    letterhead.headerImage &&
                    letterhead.footerImage
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    letterhead.name &&
                    letterhead.headerImage &&
                    letterhead.footerImage
                  ) {
                    onSave(index);
                  }
                }}
              >
                <Save className="mr-1 h-3 w-3" />
                Save
              </LoadingButton>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(index);
                }}
                disabled={!letterhead.headerImage && !letterhead.footerImage}
              >
                <Eye className="mr-1 h-3 w-3" />
                Preview
              </Button>
              <LoadingButton
                isLoading={false}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
                className="min-w-[170px] text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete Letterhead
              </LoadingButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ComponentBox type="header" image={letterhead.headerImage} />
            <ComponentBox type="footer" image={letterhead.footerImage} />
          </div>

          <ImageCropperModal
            isOpen={cropperModal.isOpen}
            onClose={() =>
              setCropperModal((prev) => ({ ...prev, isOpen: false }))
            }
            onSave={handleCropperSave}
            imageFile={cropperModal.imageFile}
            type={cropperModal.type}
            letterheadName={letterhead.name}
          />
        </CardContent>
      </Card>
    </>
  );
}
