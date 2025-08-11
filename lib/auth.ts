// Mock authentication system
export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  subscription?: {
    plan: string
    status: "active" | "inactive"
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
    createdAt: new Date("2023-12-15"),
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2023-01-01"),
    lastLogin: new Date(),
    isActive: true,
  },
]

export function authenticateUser(email: string, password: string): User | null {
  // Mock authentication - in real app, this would validate against a database
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password") {
    return user
  }
  return null
}

export function registerUser(email: string, password: string, name: string): User | null {
  // Mock registration - check if user already exists
  const existingUser = mockUsers.find((u) => u.email === email)
  if (existingUser) {
    return null // User already exists
  }

  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email,
    name,
    role: "user",
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true,
  }

  mockUsers.push(newUser)
  return newUser
}

export function resetPassword(email: string): boolean {
  // Mock password reset - check if user exists
  const user = mockUsers.find((u) => u.email === email)
  return !!user
}

export function getCurrentUser(): User | null {
  // Mock getting current user from session/token
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function setCurrentUser(user: User | null) {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      // Set cookie for middleware
      document.cookie = `currentUser=${JSON.stringify(user)}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
    } else {
      localStorage.removeItem("currentUser")
      // Remove cookie
      document.cookie = "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }
}
