'use client';

import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OtpInput } from '@/components/auth/OtpInput';

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.requestSignInOTP(phone, countryCode);

      if (response.status === 200) {
        toast.success('OTP sent successfully');
        setStep('otp');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpAndSignIn = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.verifyOTPAndSignIN(phone, countryCode, otp);

      if (response.status === 200) {
        toast.success('Login successful');
        localStorage.setItem("user", JSON.stringify(response.data));
        router.push('/dashboard');
      } else {
        toast.error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };




    const fetchUserDetails = React.useCallback(async () => {
      try {
        let user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.Id === undefined || user.Id === "" || user.Id === null || user.Token === undefined || user.Token === "" || user.Token === null || user.Session === undefined || user.Session === "" || user.Session === null) {
          notSignIn.current();
        }
      } catch (err) {
        notSignIn.current();
      }
  
    }, []);
  
    let notSignIn = React.useRef(() => { })
  
    notSignIn.current = () => {
      const currentUrl = window.location.pathname;
      if (currentUrl !== "/auth/sign-in") {
        Logout();
      }
      else redirect(currentUrl);
      return;
    }
  
    function Logout() {
      const host = window.location.hostname;
      // remove any subdomain
      localStorage.clear();
      sessionStorage.clear();
      redirect("/auth/sign-in");
    }
  
  
    React.useEffect(() => {
      fetchUserDetails();
    }, [fetchUserDetails]);
  
  



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {step === 'phone' ? 'Sign In' : 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'phone'
              ? 'Enter your phone number to receive an OTP'
              : `Enter the OTP sent to ${countryCode}${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <div className="space-y-4">
              <PhoneInput
                countryCode={countryCode}
                phone={phone}
                onCountryCodeChange={setCountryCode}
                onPhoneChange={setPhone}
              />
              <Button
                onClick={handleSendOtp}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <OtpInput value={otp} onChange={setOtp} />
              <Button
                onClick={handleVerifyOtpAndSignIn}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep('phone')}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-primary underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}