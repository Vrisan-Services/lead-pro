// lib/auth.ts
import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const authAPI = {
  requestOTP: async (
    phone: string,
    countryCode: string,
    isSignUp: boolean = false
  ) => {
    const response = await axios.post(`${API_BASE}/api/phone/request-otp/nc`, {
      phone,
      countryCode,
      isSignUp,
    });
    return response.data;
  },
  requestSignInOTP: async (
    phone: string,
    countryCode: string,
    isSignUp: boolean = false
  ) => {
    const response = await axios.post(
      `${API_BASE}/api/phone/request-partner-otp`,
      {
        phone,
        countryCode,
        isSignUp,
      }
    );
    return response.data;
  },

  verifyOTP: async (phone: string, countryCode: string, otp: string) => {
    const response = await axios.post(`${API_BASE}/api/phone/verify-otp`, {
      phone,
      countryCode,
      otp,
    });
    return response.data;
  },

  signUp: async (userData: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    city: string;
    zipCode: string;
    password: string;
  }) => {
    const response = await axios.post(`${API_BASE}/api/partnerTable/signup`, {
      Name: userData.name,
      Email: userData.email,
      Phone: userData.phone,
      PCode: userData.countryCode,
      City: userData.city,
      ZipCode: userData.zipCode,
      password: userData.password,
    });
    return response.data;
  },

  verifyOTPAndSignIN: async (
    phone: string,
    countryCode: string,
    otp: string
  ) => {
    const response = await axios.post(
      `${API_BASE}/api/phone/verify-partner-signin`,
      {
        phone,
        countryCode,
        otp,
      }
    );
    return response.data;
  },
};
