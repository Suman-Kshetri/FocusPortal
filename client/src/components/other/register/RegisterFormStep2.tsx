import { useState } from "react";
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
import type {RegisterFormStep2Props} from "@/types/formType";


const RegisterFormStep2 = ({ form, onSubmit, onBack, isLoading }: RegisterFormStep2Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (
    files: FileList | null,
    onChange: (files: FileList | null) => void
  ) => {
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      onChange(files);
    }
  };

  const clearFile = (onChange: (files: FileList | null) => void) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    onChange(null);
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field: { onChange, value, ...field } }) => (
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
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
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
                      <p className="text-sm text-gray-600 truncate max-w-full px-4">
                        {fileName}
                      </p>
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-block px-6 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition">
                          Change Photo
                        </span>
                      </Label>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600">
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
                        <p className="text-sm font-medium text-gray-700">
                          Upload your profile picture
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 2MB
                        </p>
                      </div>

                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                          Choose File
                        </span>
                      </Label>
                    </div>
                  )}

                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...field}
                    onChange={(e) => handleFileChange(e.target.files, onChange)}
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
          >
            Back
          </Button>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
            type="button"
          >
            {isLoading ? "Registering.." : "Register"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default RegisterFormStep2;