import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X } from "lucide-react";
import type { RegisterFormStep2Props } from "@/types/formType";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg"];

const RegisterFormStep2 = ({
  form,
  onSubmit,
  onBack,
  isLoading,
}: RegisterFormStep2Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Revokes the previous object URL whenever it changes, and on unmount.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: FileList | null) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
      e.target.value = "";
      form.setError("profilePicture", {
        type: "manual",
        message: "Only PNG/JPG files up to 2MB are allowed",
      });
      return;
    }

    form.clearErrors("profilePicture");
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    onChange(files);
  };

  const clearFile = (onChange: (files: FileList | null) => void) => {
    setPreviewUrl(null);
    setFileName(null);
    onChange(null);
    const input = document.getElementById(
      "file-upload"
    ) as HTMLInputElement | null;
    if (input) input.value = "";
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { onChange, ref, name, onBlur } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => clearFile(onChange)}
                          className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate max-w-full px-4">
                        {fileName}
                      </p>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-block px-6 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/10 transition">
                          Change Photo
                        </span>
                      </Label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-border rounded-lg bg-background hover:border-primary transition-colors">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background/40 text-foreground">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-medium text-primary">
                          Upload your profile picture
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>

                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-block px-6 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition">
                          Choose File
                        </span>
                      </Label>
                    </div>
                  )}

                  {/* Uncontrolled on purpose: a file input must never receive `value` */}
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    ref={ref}
                    name={name}
                    onBlur={onBlur}
                    onChange={(e) => handleFileChange(e, onChange)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 cursor-pointer"
            type="button"
            disabled={isLoading}
          >
            Back
          </Button>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="flex-1 cursor-pointer"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default RegisterFormStep2;