import { useRef, useState } from "react"
import { z } from "zod"

// Zod schema for OTP validation
const createOtpSchema = (length: number) => z.string()
  .length(length, `OTP must be exactly ${length} digits`)
  .regex(/^\d+$/, "OTP must contain only numbers");

interface OtpVerificationCardProps {
  length?: number;
  onOtpComplete?: (otp: string) => void; // Called when all digits are filled
  onOtpChange?: (otp: string) => void;   // Called on every change
  label?: string;
  autoSubmit?: boolean; // Auto call onOtpComplete when filled
}

export const OtpVerificationCard = ({
  length = 6,
  onOtpComplete,
  onOtpChange,
  label = "Enter Code",
  autoSubmit = false
}: OtpVerificationCardProps) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const otpSchema = createOtpSchema(length);

  const validateOtp = (otpValue: string): boolean => {
    try {
      otpSchema.parse(otpValue);
      setError('');
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      }
      return false;
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    
    setError('');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const otpValue = newOtp.join('');

    if (onOtpChange) {
      onOtpChange(otpValue);
    }

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (autoSubmit && newOtp.every(digit => digit !== '')) {
      if (validateOtp(otpValue)) {
        onOtpComplete?.(otpValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (isNaN(Number(pastedData))) {
      setError('Please paste only numeric values');
      return;
    }
    
    const newOtp = pastedData.split('');
    const filledOtp = [...newOtp, ...Array(length - newOtp.length).fill('')];
    setOtp(filledOtp);

    const otpValue = filledOtp.join('');

    if (onOtpChange) {
      onOtpChange(otpValue);
    }
    
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();

    if (autoSubmit && pastedData.length === length) {
      if (validateOtp(otpValue)) {
        onOtpComplete?.(otpValue);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
        {label}
      </label>
      <div className="flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => { inputRefs.current[index] = el }}
            className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
              error 
                ? 'border-red-400 bg-red-50' 
                : digit 
                ? 'border-indigo-400 bg-indigo-50' 
                : 'border-gray-300 bg-white'
            }`}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mt-3 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};