"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/lib/auth";
import { mockVoiceNotes, type VoiceNote } from "@/lib/voice-notes-data";
import { Search, Play, Clock, User, Filter, Eye, Trash2 } from "lucide-react";
import { AudioModal } from "@/components/ui/audio-modal";
import { AdminLayout } from "@/components/admin-layout";
import { toast } from "sonner";

export default function VoiceNotesPage() {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>(mockVoiceNotes);
  const [filteredNotes, setFilteredNotes] =
    useState<VoiceNote[]>(mockVoiceNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processed" | "failed"
  >("all");
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      // router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    let filtered = voiceNotes;

    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.transcription?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((note) => note.status === statusFilter);
    }

    setFilteredNotes(filtered);
  }, [searchTerm, statusFilter, voiceNotes]);

  const handleViewNote = (note: VoiceNote) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setVoiceNotes((prev) => prev.filter((note) => note.id !== noteId));
    toast.success("Voice note deleted", {
      description: "The voice note has been successfully deleted.",
    });
  };

  const handlePlayNote = (note: VoiceNote) => {
    toast.info("Playing audio", {
      description: `Playing voice note from ${note.userEmail}`,
    });
    console.log("Playing audio for note:", note.id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col items-start justify-between space-y-3 sm:flex-row sm:items-center sm:space-y-0">
          <div className="flex w-full flex-col items-start space-y-3 sm:w-auto sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search by email or transcription..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-200 bg-white pl-10"
              />
            </div>
            <div className="flex w-full items-center space-x-2 sm:w-auto">
              <Filter className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 sm:w-auto"
              >
                <option value="all">All Status</option>
                <option value="processed">Processed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Voice Notes Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead className="min-w-[100px]">Duration</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Transcription</TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotes.map((note) => (
                  <TableRow key={note.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0 rounded-full bg-gray-100 p-2">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="truncate text-sm font-medium">
                          {note.userEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="text-sm">
                          {formatDuration(note.duration)}
                        </span>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="text-sm">
                        <div>{note.timestamp.toLocaleDateString()}</div>
                        <div className="text-gray-500 text-xs">
                          {note.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(note.status)} text-xs`}
                      >
                        {note.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {note.transcription ? (
                        <p
                          className="truncate text-sm"
                          title={note.transcription}
                        >
                          {note.transcription}
                        </p>
                      ) : (
                        <span className="text-sm italic text-gray-400">
                          No transcription
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayNote(note)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">Play</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewNote(note)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredNotes.length === 0 && (
            <div className="py-8 text-center lg:py-12">
              <Search className="mx-auto mb-4 h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
              <p className="text-gray-500">
                No voice notes found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Audio Modal */}
        <AudioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          voiceNote={selectedNote}
        />
      </div>
    </>
  );
}
