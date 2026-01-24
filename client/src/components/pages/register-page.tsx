import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RegisterForm from "../registerForm";
import { useRegister } from "@/server/api/auth/useRegister";


const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().trim().min(4,"Username must be at least of minimum 4 characters").toLowerCase(),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {onSubmit,isLoading} = useRegister();
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      fullName: "",
      username: "",
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
    if (!step1Data) return;

  const finalData = {
    fullName: step1Data.fullName,
    email: step1Data.email,
    username: step1Data.username,
    password: step1Data.password,
    avatar: data.profilePicture?.[0],
  };

  console.log("Final registration data:", finalData);

  onSubmit(finalData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <RegisterForm
        step={step}
        setStep={setStep}
        step1Form={step1Form}
        step2Form={step2Form}
        onStep1Submit={onStep1Submit}
        onStep2Submit={onStep2Submit}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Register;