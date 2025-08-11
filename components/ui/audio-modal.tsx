"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, User, Clock, Calendar } from "lucide-react";
import type { VoiceNote } from "@/lib/voice-notes-data";

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceNote: VoiceNote | null;
}

export function AudioModal({ isOpen, onClose, voiceNote }: AudioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (voiceNote && audioRef.current) {
      // Mock audio duration
      setDuration(voiceNote.duration);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [voiceNote]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Mock playback progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 ";
      case "failed":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!voiceNote) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Note Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-4">
            <div className="bg-skype-blue/10 rounded-full p-2">
              <User className="text-skype-blue h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">{voiceNote.userEmail}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>{voiceNote.timestamp.toLocaleDateString()}</span>
                <span>{voiceNote.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Status and Duration */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(voiceNote.status)}>
              {voiceNote.status}
            </Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Duration: {formatTime(voiceNote.duration)}</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="from-skype-blue/5 to-skype-light-blue/5 border-skype-blue/20 rounded-lg border bg-gradient-to-r p-6">
            <div className="mb-4 flex items-center space-x-4">
              <Button
                onClick={togglePlayback}
                className="h-12 w-12 rounded-full text-white"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-2">
                  <Volume2 className="text-skype-blue h-4 w-4" />
                  <span className="text-sm font-medium">Voice Message</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="bg-skype-blue h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        duration > 0 ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcription */}
          {voiceNote.transcription && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Transcription:</h4>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm">{voiceNote.transcription}</p>
              </div>
            </div>
          )}

          {/* Mock audio element for future real implementation */}
          <audio ref={audioRef} style={{ display: "none" }}>
            <source src="/mock-audio.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </DialogContent>
    </Dialog>
  );
}
