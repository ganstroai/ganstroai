export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  subscription?: {
    plan: string
    status: "active" | "inactive" | "cancelled"
    startDate: Date
    endDate: Date
  }
  createdAt: Date
  lastLogin: Date
  isActive: boolean
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    role: "user",
    subscription: {
      plan: "Pro",
      status: "active",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    },
    createdAt: new Date("2023-12-15"),
    lastLogin: new Date("2024-01-16"),
    isActive: true,
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date("2024-01-16"),
    isActive: true,
  },
  {
    id: "3",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "user",
    subscription: {
      plan: "Basic",
      status: "active",
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-02-10"),
    },
    createdAt: new Date("2024-01-10"),
    lastLogin: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "4",
    email: "mike@example.com",
    name: "Mike Johnson",
    role: "user",
    subscription: {
      plan: "Enterprise",
      status: "cancelled",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-01-01"),
    },
    createdAt: new Date("2023-06-01"),
    lastLogin: new Date("2024-01-12"),
    isActive: false,
  },
  {
    id: "5",
    email: "sarah@example.com",
    name: "Sarah Wilson",
    role: "user",
    subscription: {
      plan: "Pro",
      status: "active",
      startDate: new Date("2023-11-01"),
      endDate: new Date("2024-11-01"),
    },
    createdAt: new Date("2023-11-01"),
    lastLogin: new Date("2024-01-16"),
    isActive: true,
  },
]
