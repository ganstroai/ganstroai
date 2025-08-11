"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserLayout } from "@/components/user-layout";
import { FloatingChat } from "@/components/floating-chat";
import { LetterheadComponent } from "@/components/letterhead";
import { LetterheadPreviewModal } from "@/components/letterhead-preview-modal";
import { Plus, Save, Eye, EyeOff, Settings, FileImage } from "lucide-react";
import { toast } from "sonner";
import { get, post } from "@/lib/server";
import { CREATE, queryNames, TEMPLATES_URL } from "@/lib/utils/constants";
import { useRouter } from "next-nprogress-bar";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingOverlay from "./LoadingOverlay";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

interface LetterheadSettings {
  id: string;
  name: string;
  headerImage: string | null;
  footerImage: string | null;
  uploadDate: Date;
}

type ApiLetter = {
  _id: string;
  header: string | null;
  footer: string | null;
  title: string;
  userId: string;
};

const UserSettings = () => {
  const [letterheads, setLetterheads] = useState<LetterheadSettings[]>([]);
  const [selectedLetterheadId, setSelectedLetterheadId] = useState<
    string | null
  >(null);
  const [selectedVAT, setSelectedVAT] = useState<number[]>([10]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [newLetterheadName, setNewLetterheadName] = useState("");

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    letterhead: null as LetterheadSettings | null,
  });

  const router = useRouter();
  console.log("letterheads", letterheads);
  console.log("selectedLetterheadId", selectedLetterheadId);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handlePasswordChange = async (data: PasswordForm) => {
    setIsPasswordLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password changed", {
        description: "Your password has been successfully updated.",
      });
      resetPasswordForm();
      setIsChangingPassword(false);
    } catch (error) {
      toast.error("Error", {
        description: "Failed to change password. Please try again.",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleCreateLetterhead = () => {
    if (!newLetterheadName.trim()) {
      toast.error("Name required", {
        description: "Please enter a name for the letterhead.",
      });
      return;
    }

    const newLetterhead: LetterheadSettings = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      name: newLetterheadName.trim(),
      headerImage: null,
      footerImage: null,
      uploadDate: new Date(),
    };

    setLetterheads((prev) => {
      const updatedLetterheads = [...prev, newLetterhead];

      // Only auto-select if this is the first letterhead
      if (prev.length === 0) {
        setSelectedLetterheadId(newLetterhead.id);
      }

      return updatedLetterheads;
    });

    setNewLetterheadName("");

    if (letterheads.length === 0) {
      toast.success("Letterhead created", {
        description: `${newLetterheadName} has been created and selected as default.`,
      });
    } else {
      toast.success("Letterhead created", {
        description: `${newLetterheadName} has been created.`,
      });
    }
  };

  const handleUpdateLetterhead = (
    index: number,
    updates: { headerImage?: string | null; footerImage?: string | null },
  ) => {
    setLetterheads((prev) =>
      prev.map((letterhead, i) =>
        i === index ? { ...letterhead, ...updates } : letterhead,
      ),
    );
  };

  const handleDeleteLetterhead = (index: number) => {
    const letterhead = letterheads[index];
    const updatedLetterheads = letterheads.filter((_, i) => i !== index);

    setLetterheads(updatedLetterheads);

    // Handle selection after deletion
    if (selectedLetterheadId === letterhead?.id) {
      if (updatedLetterheads.length > 0) {
        // Always select the first letterhead after deletion
        setSelectedLetterheadId(updatedLetterheads[0].id);
      } else {
        setSelectedLetterheadId(null);
      }
    }

    toast.error("Letterhead deleted", {
      description: `${
        letterhead?.name || "Letterhead"
      } has been completely removed.`,
    });
  };

  const handleSelectLetterhead = (index: number) => {
    const letterhead = letterheads[index];
    if (!letterhead) return;
    setSelectedLetterheadId(letterhead.id);
    toast.success("Letterhead selected", {
      description: `${letterhead.name} is now selected.`,
    });
  };

  const handlePreviewLetterhead = (index: number) => {
    const letterhead = letterheads[index];
    if (!letterhead) return;
    setPreviewModal({
      isOpen: true,
      letterhead,
    });
  };

  const handleVATChange = (vatRate: number) => {
    setSelectedVAT([vatRate]);
  };

  const handleSaveSettings = () => {
    const settings = {
      letterheads,
      selectedLetterheadId,
      selectedVAT,
    };

    setTimeout(() => {
      toast.success("Settings saved", {
        description: "Your settings have been successfully updated.",
      });
      console.log("Saved settings:", settings);
    }, 500);
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    handlePasswordChange(data);
  };

  // Get the currently selected letterhead or default to first one
  const getSelectedLetterheadId = () => {
    if (letterheads.length === 0) return null;
    if (
      selectedLetterheadId &&
      letterheads.find((l) => l.id === selectedLetterheadId)
    ) {
      return selectedLetterheadId;
    }
    return letterheads[0].id;
  };

  const currentSelectedId = getSelectedLetterheadId();

  // convert base64 dataURL to File
  const dataURLToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Handles creating a new template with FormData: title, header, footer
  const handleFormRequest = async (formData: FormData) => {
    const { status, message } = await post({
      url: `${TEMPLATES_URL}/${CREATE}`,
      payload: formData,
      isUploadDocuments: true,
    });
    if (status) {
      toast.success(message || "Template saved");
      // refresh list
      refetch();
    } else {
      toast.error(message || "Failed to save template");
    }
  };

  const { mutate, isPending } = useMutation({ mutationFn: handleFormRequest });

  const buildTemplateFormData = (l: LetterheadSettings) => {
    const fd = new FormData();
    fd.append("title", l.name);
    if (l.headerImage) {
      if (l.headerImage.startsWith("data:")) {
        fd.append(
          "header",
          dataURLToFile(l.headerImage, `header-${Date.now()}.png`),
        );
      } else {
        // if backend only accepts files, this string path won't work; keep as string if supported
        fd.append("header", l.headerImage as any);
      }
    }
    if (l.footerImage) {
      if (l.footerImage.startsWith("data:")) {
        fd.append(
          "footer",
          dataURLToFile(l.footerImage, `footer-${Date.now()}.png`),
        );
      } else {
        fd.append("footer", l.footerImage as any);
      }
    }
    return fd;
  };

  const fetchLetterheads = async () => {
    const { status, message, data } = await get({
      url: `${TEMPLATES_URL}`,
    });
    if (status) {
      const list = (Array.isArray(data) ? data : []) as ApiLetter[];
      const mapped: LetterheadSettings[] = list.map((item) => ({
        id: item._id,
        name: item.title,
        headerImage: item.header ?? null,
        footerImage: item.footer ?? null,
        uploadDate: new Date(),
      }));
      // seed into local state so UI renders the list
      setLetterheads(mapped);
      // preselect first if any
      if (mapped.length > 0) {
        setSelectedLetterheadId(mapped[0].id);
      }
      return mapped;
    } else {
      toast.error(message);
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [queryNames.LETTER_HEADS],
    queryFn: fetchLetterheads,
    refetchOnWindowFocus: false,
  });

  console.log("data", data);

  console.log("letterheads", letterheads);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div className="space-y-4 lg:space-y-6">
        {/* Letterhead Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <FileImage className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>Letterhead Management</span>
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Create and manage letterheads with separate header and footer
              sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            {/* Create New Letterhead - Always at top */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Create New Letterhead
              </Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter letterhead name (e.g., Company Letterhead)"
                  value={newLetterheadName}
                  onChange={(e) => setNewLetterheadName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateLetterhead();
                    }
                  }}
                />
                <Button onClick={handleCreateLetterhead}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </div>
            </div>

            {/* Letterheads List */}
            {letterheads.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Your Letterheads ({letterheads.length})
                  </Label>
                  {currentSelectedId && (
                    <span className="text-xs text-gray-500">
                      Selected:{" "}
                      {
                        letterheads.find((l) => l.id === currentSelectedId)
                          ?.name
                      }
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {letterheads.map((letterhead, index) => (
                    <LetterheadComponent
                      key={letterhead.id}
                      letterhead={letterhead}
                      index={index}
                      onUpdate={handleUpdateLetterhead}
                      onDelete={handleDeleteLetterhead}
                      onPreview={handlePreviewLetterhead}
                      onSelect={handleSelectLetterhead}
                      onSave={(i) => {
                        const l = letterheads[i];
                        if (!(l?.name && l?.headerImage && l?.footerImage))
                          return;
                        const fd = buildTemplateFormData(l);
                        mutate(fd);
                      }}
                      isSelected={currentSelectedId === letterhead.id}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <FileImage className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p className="text-sm">No letterheads created yet.</p>
                <p className="text-xs">
                  Create your first letterhead using the form above.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VAT Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
              <span>VAT Settings</span>
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Select applicable VAT rates for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              <Label className="text-sm font-medium">Select VAT Rates</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {[10, 15, 20].map((vatRate) => (
                  <div
                    key={vatRate}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-colors lg:p-4 ${
                      selectedVAT.includes(vatRate)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleVATChange(vatRate)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedVAT.includes(vatRate)}
                        onCheckedChange={() => handleVATChange(vatRate)}
                      />
                      <div>
                        <p className="text-base font-semibold lg:text-lg">
                          {vatRate}%
                        </p>
                        <p className="text-xs text-gray-600 lg:text-sm">
                          VAT Rate
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 lg:text-sm">
                Selected VAT rates:{" "}
                {selectedVAT.length > 0
                  ? selectedVAT.join("%, ") + "%"
                  : "None"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">
              Change Password
            </CardTitle>
            <CardDescription className="text-sm lg:text-base">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isChangingPassword ? (
              <Button onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-3 lg:space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="border-2 border-gray-200 pr-10 focus:border-primary"
                      {...registerPassword("currentPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="border-2 border-gray-200 pr-10 focus:border-primary"
                      {...registerPassword("newPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="border-2 border-gray-200 pr-10 focus:border-primary"
                      {...registerPassword("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-2 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
                    disabled={isPasswordLoading}
                  >
                    {isPasswordLoading ? "Changing..." : "Change Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent sm:w-auto"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPasswordForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <LetterheadPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        letterhead={previewModal.letterhead}
      />
    </>
  );
};

export default UserSettings;
