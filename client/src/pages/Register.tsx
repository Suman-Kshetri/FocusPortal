import { useState } from "react";
import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <CardWrapper
        title="Create a New Account"
        description={step === 1 ? "Account details" : "Upload profile picture"}
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className={`h-2 w-2 rounded-full ${
              step === 1 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
          <div
            className={`h-2 w-2 rounded-full ${
              step === 2 ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        </div>

        <form className="flex flex-col gap-4 mt-2 max-w-sm mx-auto">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Input type="text" placeholder="Full Name" />
              <Input type="email" placeholder="Email Address" />
              <Input type="password" placeholder="Password" />
              <Input type="password" placeholder="Confirm Password" />

              <Button
                type="button"
                onClick={() => setStep(2)}
                className="mt-2 bg-gray-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Next
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* Upload Card */}
              <div className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-500 transition-colors">
                {/* Icon */}
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
                      d="M7 16V12M12 16V8M17 16V12M3 20h18"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    Upload your profile picture
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>

                {/* Hidden file input */}
                <label className="cursor-pointer">
                  <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                    Choose File
                  </span>
                  <Input type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 cursor-pointer"
                >
                  Back
                </Button>

                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                  Register
                </Button>
              </div>
            </>
          )}
        </form>
      </CardWrapper>
    </div>
  );
};

export default Register;
