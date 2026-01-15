import { resetPassword } from '@/server/api/auth/useResetPassword';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/auth/reset-password/$reset-id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { "reset-id": resetId } = Route.useParams();
  const { form, onSubmit } = resetPassword();

  return (
    <form onSubmit={form.handleSubmit((data) =>
      onSubmit({ ...data, token: resetId })
    )}>
      <h1>Reset Password</h1>

      <input
        type="password"
        placeholder="New Password"
        {...form.register("password")}
      />
      {form.formState.errors.password && (
        <p>{form.formState.errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Confirm Password"
        {...form.register("confirmPassword")}
      />
      {form.formState.errors.confirmPassword && (
        <p>{form.formState.errors.confirmPassword.message}</p>
      )}

      <button type="submit" disabled={form.formState.isSubmitting}>
        Reset Password
      </button>
    </form>
  );
}
