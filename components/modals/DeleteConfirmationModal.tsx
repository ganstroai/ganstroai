import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import LoadingButton from "../LoadingButton";

interface Props {
  open: boolean;
  handleClose: () => void;
  title?: string;
  description?: string;
  isLoading: boolean;
  handleDelete: () => void;
}

const DeleteConfirmationModal: React.FC<Props> = ({
  open,
  handleClose,
  title = "Confirm Deletion",
  description = "This action cannot be undone. This will permanently delete this item and remove all associated data.",
  handleDelete,
  isLoading,
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="pt-5">
            <div className="m-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 p-3 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-destructive">
              {title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant="destructive"
              className="min-w-[105px]"
              isLoading={isLoading}
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteConfirmationModal;
