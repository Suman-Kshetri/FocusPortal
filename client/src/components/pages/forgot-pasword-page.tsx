import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPassword } from "@/server/api/auth/useForgotPassword";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const {onSubmit} = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Please enter your email and we’ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="text"
              placeholder="you@example.com"
              {...register("email")}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
