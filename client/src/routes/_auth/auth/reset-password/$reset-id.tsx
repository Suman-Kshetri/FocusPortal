import { resetPassword } from '@/server/api/auth/useResetPassword';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/auth/reset-password/$reset-id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { "reset-id": resetId } = Route.useParams();
  const { form, onSubmit } = resetPassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border p-6 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below to reset your account password.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit({ ...data, token: resetId })
          )}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              {...form.register("password")}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                form.formState.errors.password ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              {...form.register("confirmPassword")}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                form.formState.errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
