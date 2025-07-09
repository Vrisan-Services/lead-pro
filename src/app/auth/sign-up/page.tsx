// app/auth/sign-up/page.tsx
'use client';

import { Lock, Mail, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/auth';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { OtpInput } from '@/components/auth/OtpInput';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    city: '',
    zipCode: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    // Basic validation
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.requestOTP(formData.phone, formData.countryCode, true);
      
      if (response.status === 200) {
        toast.success('OTP sent successfully');
        setStep('otp');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignUp = async () => {
    try {
      setIsLoading(true);
      
      // Verify OTP first
      const otpResponse = await authAPI.verifyOTP(
        formData.phone,
        formData.countryCode,
        formData.otp
      );

      if (otpResponse.status !== 200) {
        toast.error(otpResponse.message || 'Invalid OTP');
        return;
      }

      // Proceed with signup
      const signupResponse = await authAPI.signUp({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        city: formData.city,
        zipCode: formData.zipCode,
        password: formData.password
      });

      if (signupResponse.status === 200) {
        toast.success('Account created successfully');
        router.push('/sign-in');
      } else {
        toast.error(signupResponse.message || 'Sign up failed');
      }
    } catch (error) {
      toast.error('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {step === 'form' ? 'Create Partner Account' : 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {step === 'form'
              ? 'Enter your details to register as a partner'
              : `Enter the OTP sent to ${formData.countryCode}${formData.phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'form' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <PhoneInput
                countryCode={formData.countryCode}
                phone={formData.phone}
                onCountryCodeChange={(value) => handleChange({ target: { name: 'countryCode', value } } as any)}
                onPhoneChange={(value) => handleChange({ target: { name: 'phone', value } } as any)}
              />
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Your city"
                    className="pl-10"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    placeholder="Your postal code"
                    className="pl-10"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOtp}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <OtpInput value={formData.otp} onChange={(value) => handleChange({ target: { name: 'otp', value } } as any)} />
              <Button
                onClick={handleVerifyAndSignUp}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Verify & Sign Up'}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStep('form')}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            {step === 'form' && (
              <>
                Already have an account?{' '}
                <Link href="/auth/sign-in" className="text-primary underline">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}