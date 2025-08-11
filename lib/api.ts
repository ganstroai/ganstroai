// Mock API functions for React Query
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  subscription?: {
    plan: string;
    status: "active" | "inactive" | "cancelled";
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  plan: string;
  billingPeriod: "monthly" | "yearly";
  createdAt: Date;
  paidAt?: Date;
  voiceUrl?: string;
}

// Mock API calls
export const api = {
  // User APIs
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    return updatedUser;
  },

  // Invoice APIs
  getUserInvoices: async (userId: string): Promise<Invoice[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: "1",
        userId,
        amount: 19.99,
        status: "paid",
        plan: "Pro",
        billingPeriod: "monthly",
        createdAt: new Date("2024-01-01"),
        paidAt: new Date("2024-01-01"),
        voiceUrl: "/placeholder.mp3?query=invoice-confirmation-message-1", // Sample voice message
      },
      {
        id: "2",
        userId,
        amount: 19.99,
        status: "paid",
        plan: "Pro",
        billingPeriod: "monthly",
        createdAt: new Date("2024-02-01"),
        paidAt: new Date("2024-02-01"),
        voiceUrl: "/placeholder.mp3?query=invoice-confirmation-message-2", // Sample voice message
      },
      {
        id: "3",
        userId,
        amount: 19.99,
        status: "pending",
        plan: "Pro",
        billingPeriod: "monthly",
        createdAt: new Date("2024-03-01"),
        // No voice message for pending invoice
      },
    ];
  },

  // Subscription APIs
  updateSubscription: async (userId: string, planData: any): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = {
      ...currentUser,
      subscription: {
        plan: planData.name,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    return updatedUser;
  },
};
