import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import RegisterFormStep1 from "./other/register/RegisterFormStep1";
import RegisterFormStep2 from "./other/register/RegisterFormStep2";
import type {RegisterFormProps} from "@/types/formType";

const RegisterForm = ({
  step,
  setStep,
  step1Form,
  step2Form,
  onStep1Submit,
  onStep2Submit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: RegisterFormProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          {step === 1
            ? "Enter your account details"
            : "Upload your profile picture"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={`h-2 w-2 rounded-full transition-colors ${
              step === 1 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full transition-colors ${
              step === 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        </div>

        {/* Step 1: Account Details */}
        {step === 1 && (
          <RegisterFormStep1
            form={step1Form}
            onSubmit={onStep1Submit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        )}

        {/* Step 2: Profile Picture */}
        {step === 2 && (
          <RegisterFormStep2
            form={step2Form}
            onSubmit={onStep2Submit}
            onBack={() => setStep(1)}
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;