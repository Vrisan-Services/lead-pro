// components/auth/OtpInput.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function OtpInput({ value, onChange }: OtpInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="otp">OTP Code</Label>
      <Input
        id="otp"
        type="text"
        placeholder="Enter 6-digit OTP"
        className="text-center text-lg font-mono tracking-widest"
        maxLength={6}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}