import { useLogin } from "@/server/api/auth/useLogin";
import LoginForm from "@/components/LoginForm";
import GoToHomeButton from "../ui/GotoHomeButton";

const Login = () => {
  const { form, onSubmit, isLoading } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background/40 px-4">
      <div className="absolute top-6 left-6">
        <GoToHomeButton />
      </div>
      <div className="w-full max-w-md">
        <LoginForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Login;
