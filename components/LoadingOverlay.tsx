import React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  isLoading?: boolean;
  spinnerClassName?: string;
}

const LoadingOverlay: React.FC<Props> = ({
  isLoading = false,
  spinnerClassName = "",
}) => {
  if (!isLoading) return null;

  return (
    <>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-200">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className={cn(
              "h-10 w-10 animate-spin text-primary",
              spinnerClassName,
            )}
          />
          <p className="text-center text-sm font-medium">Loading...</p>
        </div>
      </div>
    </>
  );
};

export default LoadingOverlay;
