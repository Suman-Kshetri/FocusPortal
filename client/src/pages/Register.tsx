import { useState } from "react";
import { useForm } from "react-hook-form";
import {Link} from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});


const step2Schema = z.object({
  profilePicture: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length === 0 || files[0].size <= 2000000,
    "File size must be less than 2MB"
  ).refine(
    (files) => !files || files.length === 0 || ["image/jpeg", "image/jpg", "image/png"].includes(files[0].type),
    "Only .jpg, .jpeg, .png formats are supported"
  )
});

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;

const Register = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);


  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema)
  });

  const onStep1Submit = (data: Step1FormData) => {
    setStep1Data(data); 
    setStep(2);
  };


  const onStep2Submit = (data: Step2FormData) => {

    const finalData = {
      ...step1Data, // Spreads: fullName, email, password, confirmPassword
      profilePicture: data.profilePicture?.[0] 
    };
    
    console.log("Final registration data:", finalData);
    // API
    alert("Registration successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your account details" : "Upload your profile picture"}
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`h-2 w-2 rounded-full transition-colors ${step === 1 ? "bg-blue-600" : "bg-gray-300"}`} />
            <div className={`h-2 w-2 rounded-full transition-colors ${step === 2 ? "bg-blue-600" : "bg-gray-300"}`} />
          </div>


          {step === 1 && (
            <Form {...step1Form}>
              <div className="space-y-4">
                <FormField
                  control={step1Form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={step1Form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  onClick={step1Form.handleSubmit(onStep1Submit)}
                  className="w-full cursor-pointer"
                  type="button"
                >
                  Next
                </Button>
              </div>
            </Form>
          )}

          {step === 2 && (
            <Form {...step2Form}>
              <div className="space-y-6">
                <FormField
                  control={step2Form.control}
                  name="profilePicture"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-blue-500 transition-colors">
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                          </div>

                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              Upload your profile picture
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                          </div>

                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <span className="inline-block px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                              Choose File
                            </span>
                            <Input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              {...field}
                              onChange={(e) => onChange(e.target.files)}
                            />
                          </Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    type="button"
                  >
                    Back
                  </Button>

                  <Button
                    onClick={step2Form.handleSubmit(onStep2Submit)}
                    className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                    type="button"
                  >
                    Register
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;