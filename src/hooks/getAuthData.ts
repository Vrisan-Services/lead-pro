// lib/auth.ts
interface AuthData {
  Id: string;
  Token: string;
  Session: string;
}

export function getAuthData(): AuthData {
  const userData = localStorage.getItem('user');
  console.log("User data retrieved from localStorage:", userData); // Debug log
  
  if (!userData) {
    throw new Error('User authentication data not found');
  }

  try {
    const { Id, Token, Session } = JSON.parse(userData);
    
    if (!Id || !Token || !Session) {
      throw new Error('Invalid authentication data');
    }

    return { Id, Token, Session };
  } catch (error) {
    throw new Error('Failed to parse authentication data');
  }
}