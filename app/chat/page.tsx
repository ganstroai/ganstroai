"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Send,
  LogOut,
  Clock,
  Bot,
} from "lucide-react";
import { SimpleButton } from "@/components/ui/simple-button";
import { toast } from "sonner";

interface VoiceMessage {
  id: string;
  duration: number;
  timestamp: Date;
  isPlaying: boolean;
}

export default function ChatPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [user, setUser] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "user") {
      // router.push("/login");
      // return;
    }

    // if (!currentUser.subscription) {
    //   router.push("/subscriptions");
    //   return;
    // }

    // setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    toast.info("Recording started", {
      description: "Speak your message now...",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (recordingDuration > 0) {
      const newMessage: VoiceMessage = {
        id: Date.now().toString(),
        duration: recordingDuration,
        timestamp: new Date(),
        isPlaying: false,
      };

      setVoiceMessages((prev) => [...prev, newMessage]);
      toast.success("Recording saved", {
        description: `Voice message recorded (${recordingDuration}s)`,
      });
    }

    setRecordingDuration(0);
  };

  const togglePlayback = (messageId: string) => {
    setVoiceMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, isPlaying: !msg.isPlaying }
          : { ...msg, isPlaying: false },
      ),
    );
  };

  const sendMessage = (messageId: string) => {
    toast.success("Message sent", {
      description: "Your voice message has been sent successfully!",
    });
    console.log("Sending message:", messageId);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-2">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI Voice Chat
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email} • {user?.subscription?.plan} Plan
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              {user?.subscription?.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-transparent text-gray-700 dark:text-gray-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Recording Panel */}
          <div className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Record Voice Message</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col space-y-6">
                <div className="flex flex-grow flex-col justify-center text-center">
                  <div
                    className={`mx-auto flex h-40 w-40 cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${
                      isRecording
                        ? "bg-red-500 shadow-2xl shadow-red-500/50"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/30"
                    }`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <MicOff className="h-16 w-16 text-white" />
                    ) : (
                      <Mic className="h-16 w-16 text-white" />
                    )}
                  </div>

                  <div className="mt-6">
                    {isRecording ? (
                      <div className="space-y-4">
                        <p className="text-lg font-bold text-red-600">
                          Recording...
                        </p>
                        <p className="font-mono text-4xl font-bold text-purple-600">
                          {formatDuration(recordingDuration)}
                        </p>
                        <div className="flex justify-center space-x-1">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-1 animate-pulse rounded-full bg-red-500"
                              style={{
                                height: `${Math.random() * 30 + 10}px`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          Tap to start recording
                        </p>
                        <p className="text-sm text-gray-500">
                          Hold and speak clearly
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <p className="mb-1 font-medium">Recording Instructions:</p>
                  <p>• Click to start/stop recording</p>
                  <p>• Maximum duration: 5 minutes</p>
                  <p>• Speak clearly into your microphone</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Panel */}
          <div className="h-full">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Voice Messages</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col">
                {voiceMessages.length === 0 ? (
                  <div className="flex flex-grow flex-col justify-center py-12 text-center">
                    <Bot className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">
                      No voice messages yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Start recording to create your first message!
                    </p>
                  </div>
                ) : (
                  <div className="flex-grow space-y-4 overflow-auto">
                    {voiceMessages.map((message) => (
                      <div
                        key={message.id}
                        className="rounded-lg border-2 border-purple-200 bg-gradient-to-r from-white to-purple-50/30 p-4 dark:border-purple-800 dark:from-gray-800 dark:to-purple-950/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlayback(message.id)}
                              className="border-purple-300 hover:bg-purple-600 hover:text-white"
                            >
                              {message.isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>

                            <div>
                              <p className="font-semibold text-purple-600">
                                Voice Message
                              </p>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{formatDuration(message.duration)}</span>
                                <span>•</span>
                                <span>
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <SimpleButton
                            size="sm"
                            onClick={() => sendMessage(message.id)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Send
                          </SimpleButton>
                        </div>

                        {message.isPlaying && (
                          <div className="mt-4">
                            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className="h-3 rounded-full bg-purple-600 transition-all duration-300"
                                style={{ width: "45%" }}
                              />
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-gray-500">
                              <span>0:12</span>
                              <span>{formatDuration(message.duration)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Info */}
        <div className="mx-auto mt-8 max-w-4xl">
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="grid gap-6 text-center md:grid-cols-3">
                <div>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <Mic className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 font-semibold">AI-Enhanced Recording</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Crystal clear voice recording with AI noise cancellation
                  </p>
                </div>
                <div>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 font-semibold">Instant AI Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send voice messages with AI-powered instant processing
                  </p>
                </div>
                <div>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-semibold">Smart History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI-organized message history and insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
