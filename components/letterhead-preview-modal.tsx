"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { API_PUBLIC_URL } from "@/lib/utils/constants";

interface LetterheadPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterhead: {
    id: string;
    name: string;
    headerImage: string | File | null;
    footerImage: string | File | null;
    uploadDate: Date;
  } | null;
}

export function LetterheadPreviewModal({
  isOpen,
  onClose,
  letterhead,
}: LetterheadPreviewModalProps) {
  if (!letterhead) return null;

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview: {letterhead.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Preview */}
          <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
            {/* Header */}
            {letterhead.headerImage && (
              <div className="mb-8">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Header
                </h3>
                <img
                  src={
                    typeof letterhead.headerImage === "string"
                      ? `${API_PUBLIC_URL}/${letterhead.headerImage}` ||
                        "/placeholder.svg"
                      : URL.createObjectURL(letterhead.headerImage)
                  }
                  alt="Header"
                  className="w-full rounded border border-gray-200"
                />
              </div>
            )}

            {/* Sample Content */}
            <div className="my-12">
              <div className="space-y-4 text-gray-600">
                <div className="flex h-32 flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-gray-300 bg-gray-50">
                  <p className="text-sm">
                    Sample document content would appear here...
                  </p>
                  <span className="text-sm text-gray-400">
                    Document Body Content
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            {letterhead.footerImage && (
              <div className="mt-8">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Footer
                </h3>
                <img
                  src={
                    typeof letterhead.footerImage === "string"
                      ? `${API_PUBLIC_URL}/${letterhead.footerImage}` ||
                        "/placeholder.svg"
                      : URL.createObjectURL(letterhead.footerImage)
                  }
                  alt="Footer"
                  className="w-full rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
