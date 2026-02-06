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
          flex items-center gap-2 px-6 py-2.5
          bg-primary text-primary-foreground
          rounded-lg font-semibold text-sm
          hover:bg-primary/90
          hover-lift transition-all
          shadow-md
        "
      >
        <PlusCircle className="w-5 h-5" />
        Ask Question
      </button>

      {isOpen && (
        <div
          className="
            fixed inset-0
            bg-background/60 backdrop-blur-md
            flex items-center justify-center
            p-4 z-50 
            animate-fade-in
          "
          onClick={closeDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              bg-card
              rounded-2xl shadow-xl
              max-w-2xl w-full max-h-[90vh]
              overflow-hidden
              animate-scale-in
              border border-border
            "
          >
            {/* Header */}
            <div
              className="
                sticky top-0
                bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
                border-b border-border
                px-8 py-5
                flex justify-between items-center
              "
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">Ask a Question</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your problem and get help from the community
                </p>
              </div>
              <button
                onClick={closeDialog}
                className="
                  w-9 h-9 flex items-center justify-center
                  text-muted-foreground
                  hover:text-foreground hover:bg-muted
                  rounded-full
                  transition-all
                "
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Question Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. How does MongoDB indexing work?"
                  className="
                    w-full px-4 py-3
                    bg-background
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary/50
                    focus:border-primary
                    transition-all
                    text-foreground
                    placeholder:text-muted-foreground/60
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Explain your problem clearly. Include what you've tried and what you expect to happen..."
                  className="
                    w-full px-4 py-3
                    bg-background
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary/50
                    focus:border-primary
                    resize-none transition-all
                    text-foreground
                    placeholder:text-muted-foreground/60
                  "
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 bg-background
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary/50
                    focus:border-primary
                    transition-all
                    cursor-pointer
                    text-foreground
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
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Tags{" "}
                  <span className="text-muted-foreground text-xs font-normal">
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
                    w-full px-4 py-3
                    bg-background
                    border border-border rounded-lg
                    focus:ring-2 focus:ring-primary/50
                    focus:border-primary
                    transition-all
                    text-foreground
                    placeholder:text-muted-foreground/60
                  "
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Add relevant tags to help others find your question
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
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

            {/* Footer */}
            <div
              className="
                sticky bottom-0
                bg-card/95 backdrop-blur-sm
                border-t border-border
                px-8 py-4
                flex justify-end gap-3
              "
            >
              <button
                onClick={closeDialog}
                className="
                  px-6 py-2.5
                  bg-secondary text-secondary-foreground
                  rounded-lg font-medium
                  hover:bg-accent
                  transition-all
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
                  px-6 py-2.5
                  bg-primary text-primary-foreground
                  rounded-lg font-semibold
                  hover:bg-primary/90
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  hover-lift transition-all
                  shadow-md
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
