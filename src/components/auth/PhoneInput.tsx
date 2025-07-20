'use client';

import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PhoneInput({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange
}: {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex gap-2">
        <Input
          id="countryCode"
          type="text"
          placeholder="+91"
          className="w-20"
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
        />
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="9876543210"
            className="pl-10"
            required
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}