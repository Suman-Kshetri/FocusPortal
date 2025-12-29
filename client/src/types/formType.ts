export interface RegisterFormStep1Props {
  form: any;
  onSubmit: (data: any) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
}

export interface RegisterFormStep2Props {
  form: any;
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export interface RegisterFormProps {
  step: number;
  setStep: (step: number) => void;
  step1Form: any;
  step2Form: any;
  onStep1Submit: (data: any) => void;
  onStep2Submit: (data: any) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
}
