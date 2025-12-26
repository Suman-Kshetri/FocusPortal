import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
       
        {/* Login Section */}
        <CardWrapper
          title="Welcome Back"
          description="Login to your account"
          backButtonHref="/auth/register"
          backButtonLabel="Don't have an account?"
        >
          <form className="flex flex-col gap-4 mt-4">
            <Input
              type="email"
              placeholder="Email Address"
              className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                placeholder="Password"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Link
                to="/auth/forget-password"
                className="text-sm text-blue-600 hover:underline mt-1"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="mt-1 bg-gray-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors cursor-pointer"
            >
              Login
            </Button>
          </form>
        </CardWrapper>
      </div>
  );
};

export default AuthPage;
