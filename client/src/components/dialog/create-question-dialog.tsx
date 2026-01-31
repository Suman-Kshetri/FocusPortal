import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/imageUpload";
import { useCreateQuestion } from "@/server/api/questions/createQuestions";
import type { QuestionFormData } from "@/types/questionType";

export const CreateQuestions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { onSubmit } = useCreateQuestion();

  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    content: "",
    category: "",
    tags: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
    });
    setImageFiles([]);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setImageFiles(files);
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("category", formData.category);

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    payload.append("tags", JSON.stringify(tagsArray));

    imageFiles.forEach((file) => {
      payload.append("images", file);
    });

    onSubmit(payload);

    closeDialog();
  };

  return (
    <div>
      <button
        onClick={openDialog}
        className="
          flex items-center gap-2 px-5 py-2
          bg-primary text-primary-foreground
          rounded-lg font-semibold
          hover:bg-primary/90
          hover-lift transition-all
        "
      >
        <PlusCircle className="w-4 h-4" />
        Ask Question
      </button>

      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-background/90 backdrop-blur-sm
            flex items-center justify-center
            p-4 z-50 
            animate-fade-in
          "
          onClick={closeDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-background border border-border
              rounded-xl shadow-2xl
              max-w-3xl w-full max-h-[90vh]
              overflow-y-auto scrollbar-hide
              card-elevated animate-scale-in
            "
          >
            {/* Header */}
            <div
              className="
                sticky top-0
                bg-background
                border-b border-border
                px-6 py-4
                flex justify-between items-center
              "
            >
              <h2 className="text-xl font-bold">Ask a Question</h2>
              <button
                onClick={closeDialog}
                className="
                  text-muted-foreground
                  hover:text-red-500
                  transition-colors
                "
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Question Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. How does MongoDB indexing work?"
                  className="
                    w-full px-4 py-2.5
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary
                    focus:border-transparent
                    transition-shadow
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Explain your problem clearly. Include what you've tried and what you expect to happen..."
                  className="
                    w-full px-4 py-2.5
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary
                    focus:border-transparent
                    resize-none transition-shadow
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-2.5 bg-background
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary
                    focus:border-transparent
                    transition-shadow 
                  "
                  required
                >
                  <option value="">Select category</option>
                  <option value="Programming">Programming</option>
                  <option value="Databases">Databases</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags{" "}
                  <span className="text-muted-foreground text-xs">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="react, mongodb, nodejs"
                  className="
                    w-full px-4 py-2.5
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary
                    focus:border-transparent
                    transition-shadow
                  "
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add relevant tags to help others find your question
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Supporting Images{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional - helps explain your problem)
                  </span>
                </label>
                <ImageUpload
                  onImagesChange={handleImagesChange}
                  maxImages={2}
                  maxSizeMB={10}
                />
              </div>
            </div>

            <div
              className="
                sticky bottom-0
                bg-background/80
                px-5 py-2
                flex justify-end gap-3
              "
            >
              <button
                onClick={closeDialog}
                className="
                  px-5 py-2.5
                  bg-secondary text-secondary-foreground
                  rounded-lg
                  hover:bg-accent
                  transition-colors
                "
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  !formData.title || !formData.content || !formData.category
                }
                className="
                  px-5 py-2.5
                  bg-primary text-primary-foreground
                  rounded-lg
                  hover:bg-primary/90
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  hover-lift transition-all
                "
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
