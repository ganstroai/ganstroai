"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  Play,
  Pause,
  Trash2,
  Loader2,
} from "lucide-react";

interface VoiceMessage {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  type: "user" | "ai";
}

interface TextMessage {
  id: string;
  text: string;
  type: "user" | "ai";
}

type Message = VoiceMessage | TextMessage;

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingAudio, setPendingAudio] = useState<{
    blob: Blob;
    url: string;
    duration: number;
  } | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Cleanup function
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      Object.values(audioElementsRef.current).forEach((audio) => {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      });
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Capture the current recording time before it gets reset
        const currentDuration = recordingTime;

        setPendingAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: currentDuration,
        });

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Clear the interval first to ensure we have the final recording time
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      // Then stop the media recorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadVoiceToServer = async (audioBlob: Blob) => {
    const formData = new FormData();

    // Convert blob to file with proper extension
    const audioFile = new File([audioBlob], `voice_${Date.now()}.wav`, {
      type: audioBlob.type || "audio/wav",
    });

    // Add the audio file to formData with the key 'voiceNote'
    formData.append("voiceNote", audioFile);

    try {
      const response = await fetch("{{local_url}}voice/upload", {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header - browser will set it with boundary for multipart/form-data
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading voice message:", error);
      throw error;
    }
  };

  const sendVoiceMessage = async () => {
    if (!pendingAudio) return;

    setIsUploading(true);

    try {
      // Add the voice message to the UI immediately
      const newMessage: VoiceMessage = {
        id: Date.now().toString(),
        audioBlob: pendingAudio.blob,
        audioUrl: pendingAudio.url,
        duration: pendingAudio.duration,
        type: "user",
      };

      setMessages((prev) => [...prev, newMessage]);

      // Upload to server
      const uploadResponse = await uploadVoiceToServer(pendingAudio.blob);

      // Clear pending audio
      setPendingAudio(null);
      setRecordingTime(0);

      // Handle server response - adjust based on your API response structure
      if (uploadResponse) {
        // If your API returns a text response or transcription
        const aiResponse: TextMessage = {
          id: (Date.now() + 1).toString(),
          text:
            uploadResponse.message ||
            uploadResponse.transcription ||
            "Voice message received successfully!",
          type: "ai",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      // Handle error - show error message
      console.error("Failed to send voice message:", error);

      const errorMessage: TextMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your voice message. Please try again.",
        type: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Optionally, you might want to restore the pending audio so user can retry
      // setPendingAudio(pendingAudio);
    } finally {
      setIsUploading(false);
    }
  };

  const discardVoiceMessage = () => {
    if (pendingAudio) {
      URL.revokeObjectURL(pendingAudio.url);
      setPendingAudio(null);
      setRecordingTime(0);
    }
  };

  const toggleAudioPlayback = (messageId: string, audioUrl: string) => {
    const audio = audioElementsRef.current[messageId];

    if (audio) {
      if (playingAudio === messageId) {
        audio.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        Object.entries(audioElementsRef.current).forEach(([id, audioEl]) => {
          if (id !== messageId) {
            audioEl.pause();
          }
        });

        audio.currentTime = 0;
        audio.play();
        setPlayingAudio(messageId);
      }
    } else {
      // Create new audio element
      const newAudio = new Audio(audioUrl);
      audioElementsRef.current[messageId] = newAudio;

      newAudio.onended = () => {
        setPlayingAudio(null);
      };

      newAudio.onerror = () => {
        console.error("Error playing audio");
        setPlayingAudio(null);
      };

      newAudio.play();
      setPlayingAudio(messageId);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const VoiceMessageBubble = ({ message }: { message: VoiceMessage }) => (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-3 ${
          message.type === "user"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-full p-0 ${
              message.type === "user"
                ? "text-white hover:bg-primary-foreground/20"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => toggleAudioPlayback(message.id, message.audioUrl)}
          >
            {playingAudio === message.id ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full bg-current ${
                      playingAudio === message.id ? "h-3 animate-pulse" : "h-2"
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-1 text-xs opacity-70">
              {formatTime(message.duration)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const TextMessageBubble = ({ message }: { message: TextMessage }) => (
    <div
      className={`flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          message.type === "user"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.text}
      </div>
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex h-[500px] flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              AI Voice Chat
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-auto p-4">
            {messages.length === 0 ? (
              <div className="mt-8 text-center text-gray-500">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <p>Start a conversation with your AI assistant</p>
                <p className="mt-2 text-xs">
                  Tap the microphone to record a voice message
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id}>
                  {"audioBlob" in message ? (
                    <VoiceMessageBubble message={message} />
                  ) : (
                    <TextMessageBubble message={message} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Voice Recording Interface */}
          <div className="border-t p-4">
            {pendingAudio ? (
              /* Pending Audio Preview */
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Voice Message Ready
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(pendingAudio.duration)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 rounded-full bg-transparent p-0"
                      onClick={() =>
                        toggleAudioPlayback("pending", pendingAudio.url)
                      }
                    >
                      {playingAudio === "pending" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="flex flex-1 space-x-1">
                      {[...Array(15)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full bg-primary ${
                            playingAudio === "pending"
                              ? "h-3 animate-pulse"
                              : "h-2"
                          }`}
                          style={{
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={discardVoiceMessage}
                    className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={isUploading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                  <Button
                    onClick={sendVoiceMessage}
                    className="bg-primary hover:bg-primary/90"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Recording Interface */
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`h-12 w-12 rounded-full ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-primary hover:bg-primary/90"
                    }`}
                    size="icon"
                  >
                    {isRecording ? (
                      <MicOff className="h-6 w-6 text-white" />
                    ) : (
                      <Mic className="h-6 w-6 text-white" />
                    )}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium text-red-500">
                        Recording... {formatTime(recordingTime)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-gray-500">
                  {isRecording
                    ? "Tap to stop recording"
                    : "Tap to start voice recording"}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
