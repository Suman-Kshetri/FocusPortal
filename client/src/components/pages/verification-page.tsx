import { useState } from 'react';
import {OtpVerificationCard} from '../otp-verification-card'
import { useVerify } from '@/server/api/auth/useVerify';


export const VerifyEmail = () => {
  const [otpValue, setOtpValue] = useState('');
  const {onSubmit,isLoading} = useVerify();

  const handleOtpComplete = async (otp: string) => {
    onSubmit(otp)
  };

  const handleOtpChange = (otp: string) => {
    console.log("data: ", otp)
    setOtpValue(otp);
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
    
    <h1 className="text-2xl font-bold text-center mb-6">
      Verify Your Email
    </h1>

    <OtpVerificationCard 
      length={6}
      label="Enter verification code"
      onOtpComplete={handleOtpComplete}  
      onOtpChange={handleOtpChange}      
      autoSubmit={true}                  
    />

    <button 
      onClick={() => handleOtpComplete(otpValue)}
      disabled={otpValue.length !== 6}
      className={`mt-6 w-full px-4 py-2 rounded-lg font-medium transition
        ${
          otpValue.length === 6
            ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
       {isLoading ? "Verifying..." : "Verify"}
    </button>

  </div>
</div>

  );
};

