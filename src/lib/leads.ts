const BASE_URL = 'http://localhost:8000';

export const leadsAPI = {
  async createLead(data: any) {
    try {
      const response = await fetch(`${BASE_URL}/api/socialLeads/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  async bulkCreateLeads(data: any) {
    try {
      const response = await fetch(`${BASE_URL}/api/socialLeads/create/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error bulk creating leads:', error);
      throw error;
    }
  }
};