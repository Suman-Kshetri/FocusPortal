import { useLogin } from "@/server/api/auth/useLogin";
import LoginForm from "@/components/LoginForm";


const Login = () => {
  const { form, onSubmit, isLoading, error } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <LoginForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Login;