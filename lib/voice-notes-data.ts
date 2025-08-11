export interface VoiceNote {
  id: string
  userId: string
  userEmail: string
  duration: number
  timestamp: Date
  transcription?: string
  status: "pending" | "processed" | "failed"
}

export const mockVoiceNotes: VoiceNote[] = [
  {
    id: "1",
    userId: "1",
    userEmail: "user@example.com",
    duration: 45,
    timestamp: new Date("2024-01-15T10:30:00"),
    transcription: "Hello, this is a test voice message about the new project requirements.",
    status: "processed",
  },
  {
    id: "2",
    userId: "1",
    userEmail: "user@example.com",
    duration: 32,
    timestamp: new Date("2024-01-15T11:15:00"),
    transcription: "Quick update on the meeting scheduled for tomorrow.",
    status: "processed",
  },
  {
    id: "3",
    userId: "3",
    userEmail: "john@example.com",
    duration: 67,
    timestamp: new Date("2024-01-15T14:20:00"),
    transcription: "Detailed feedback on the latest design mockups and suggestions for improvements.",
    status: "processed",
  },
  {
    id: "4",
    userId: "4",
    userEmail: "sarah@example.com",
    duration: 28,
    timestamp: new Date("2024-01-15T16:45:00"),
    status: "pending",
  },
  {
    id: "5",
    userId: "1",
    userEmail: "user@example.com",
    duration: 55,
    timestamp: new Date("2024-01-16T09:10:00"),
    transcription: "Follow-up on yesterday's discussion about the budget allocation.",
    status: "processed",
  },
]
