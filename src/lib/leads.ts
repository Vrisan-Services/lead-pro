// lib/leads.ts
import { getAuthData } from "../hooks/getAuthData";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface LeadData {
  leadName: string;
  contactDetails: string;
  dealValue: number;
  stage: "New" | "In Progress" | "Qualified" | "Closed";
  lastInteraction: string;
  additionalDetails?: string;
  assignedBy?: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const leadsAPI = {
  async createSingleLead(formData: LeadData): Promise<ApiResponse> {
    try {
      console.log("Starting API call with formData:", formData); // Debug log

      const { Id, Token, Session } = getAuthData();
      console.log("Auth data retrieved:", { Id, Token, Session }); // Debug log

      if (!Id || !Token || !Session) {
        throw new Error("Authentication data not found");
      }

      const payload = {
        Id,
        Token,
        Session,
        socialLeads: {
          Name: formData.leadName,
          Email: formData.contactDetails,
          Budget: formData.dealValue,
          Stage: formData.stage,
          Description: formData.lastInteraction,
          Notes: formData.additionalDetails || "",
          Location: null,
          Phone: "",
          PCode: "+91",
          Source: "10",
          Type: "",
          Size: "",
          Category: "",
          AssignedBy: "",
        },
      };

      console.log("Prepared payload:", payload); // Debug log

      const response = await fetch(`${BASE_URL}/api/socialLeads/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Raw fetch response:", response); // Debug log

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("Error response data:", errorData); // Debug log
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Successful response data:", responseData); // Debug log

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error in createSingleLead:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
  async getLeads(): Promise<ApiResponse> {
    try {
      const { Id, Token, Session } = getAuthData();
      console.log("Auth data retrieved for getLeads:", { Id, Token, Session }); // Debug log

      if (!Id || !Token || !Session) {
        throw new Error("Authentication data not found");
      }

      const queryParams = new URLSearchParams({
        Id,
        Token,
        Session,
      });

      const response = await fetch(`${BASE_URL}/api/socialLeads/all?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const responseData = await response.json();
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error in getLeads:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
