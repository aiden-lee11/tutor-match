const API_BASE_URL = 'http://localhost:8080/api';

export interface Tutor {
  id?: number;
  name: string;
  email?: string;
  subjects: string[];
  pay: number;
  rating?: number;
  bio: string;
}

export interface Client {
  id?: number;
  name: string;
  email: string;
  subjects: string[];
  budget: number;
  description?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Tutor endpoints
  async getTutors(): Promise<ApiResponse<Tutor[]>> {
    return this.request<Tutor[]>('/tutors');
  }

  async createTutor(tutor: Omit<Tutor, 'id'>): Promise<ApiResponse<Tutor>> {
    return this.request<Tutor>('/tutors', {
      method: 'POST',
      body: JSON.stringify(tutor),
    });
  }

  async getTutorByEmail(email: string): Promise<ApiResponse<Tutor | null>> {
    const encodedEmail = encodeURIComponent(email);
    return this.request<Tutor | null>(`/tutors/by-email/${encodedEmail}`);
  }

  // Client endpoints
  async getClients(): Promise<ApiResponse<Client[]>> {
    return this.request<Client[]>('/clients');
  }

  async createClient(client: Omit<Client, 'id'>): Promise<ApiResponse<Client>> {
    return this.request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  async getClientByEmail(email: string): Promise<ApiResponse<Client | null>> {
    const encodedEmail = encodeURIComponent(email);
    return this.request<Client | null>(`/clients/by-email/${encodedEmail}`);
  }

  // Check if user has any existing profile
  async checkUserProfile(email: string): Promise<{ 
    hasProfile: boolean; 
    userType: 'tutor' | 'student' | null;
    profileData: Tutor | Client | null;
  }> {
    try {
      // Check for client profile first
      const clientResponse = await this.getClientByEmail(email);
      if (clientResponse.data) {
        return {
          hasProfile: true,
          userType: 'student',
          profileData: clientResponse.data
        };
      }

      // Check for tutor profile
      const tutorResponse = await this.getTutorByEmail(email);
      if (tutorResponse.data) {
        return {
          hasProfile: true,
          userType: 'tutor',
          profileData: tutorResponse.data
        };
      }

      return {
        hasProfile: false,
        userType: null,
        profileData: null
      };
    } catch (error) {
      console.error('Error checking user profile:', error);
      return {
        hasProfile: false,
        userType: null,
        profileData: null
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch('http://localhost:8080/health');
    return response.json();
  }
}

export const apiService = new ApiService(); 