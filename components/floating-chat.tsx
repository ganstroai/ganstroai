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

        setPendingAudio({
          blob: audioBlob,
          url: audioUrl,
          duration: recordingTime,
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
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const sendVoiceMessage = () => {
    if (!pendingAudio) return;

    const newMessage: VoiceMessage = {
      id: Date.now().toString(),
      audioBlob: pendingAudio.blob,
      audioUrl: pendingAudio.url,
      duration: pendingAudio.duration,
      type: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setPendingAudio(null);
    setRecordingTime(0);

    // Simulate AI response (text response for now)
    setTimeout(() => {
      const aiResponse: TextMessage = {
        id: (Date.now() + 1).toString(),
        text: "I received your voice message! How can I help you today?",
        type: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
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
        className={`max-w-xs px-4 py-3 rounded-lg ${
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
                ? "hover:bg-primary-foreground/20 text-white"
                : "hover:bg-gray-200 text-gray-700"
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
                    className={`w-1 bg-current rounded-full ${
                      playingAudio === message.id ? "animate-pulse h-3" : "h-2"
                    }`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs mt-1 opacity-70">
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
        className={`max-w-xs px-4 py-2 rounded-lg ${
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              AI Voice Chat
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-auto space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation with your AI assistant</p>
                <p className="text-xs mt-2">
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
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
                      className="h-8 w-8 rounded-full p-0 bg-transparent"
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
                    <div className="flex-1 flex space-x-1">
                      {[...Array(15)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-primary rounded-full ${
                            playingAudio === "pending"
                              ? "animate-pulse h-3"
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
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Discard
                  </Button>
                  <Button
                    onClick={sendVoiceMessage}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
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
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-500 text-sm font-medium">
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
