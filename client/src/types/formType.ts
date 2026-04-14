import type { UseFormReturn } from "react-hook-form";

export interface RegisterStep1FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterStep2FormData {
  profilePicture?: FileList;
}

export interface RegisterFormStep1Props {
  form: UseFormReturn<RegisterStep1FormData>;
  onSubmit: (data: RegisterStep1FormData) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
}

export interface RegisterFormStep2Props {
  form: UseFormReturn<RegisterStep2FormData>;
  onSubmit: (data: RegisterStep2FormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export interface RegisterFormProps {
  step: number;
  setStep: (step: number) => void;
  step1Form: UseFormReturn<RegisterStep1FormData>;
  step2Form: UseFormReturn<RegisterStep2FormData>;
  onStep1Submit: (data: RegisterStep1FormData) => void;
  onStep2Submit: (data: RegisterStep2FormData) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  isLoading: boolean;
}
