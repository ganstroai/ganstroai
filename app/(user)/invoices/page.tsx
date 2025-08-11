"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { UserLayout } from "@/components/user-layout";
import { FloatingChat } from "@/components/floating-chat";
import { Download, Receipt, Volume2 } from "lucide-react";
import { UserInvoiceSummary } from "@/components/user-invoice-summary";
import { useState } from "react";
import { VoicePlayer } from "@/components/voice-player";

export default function InvoicesPage() {
  const [playingInvoice, setPlayingInvoice] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: api.getCurrentUser,
  });

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices", user?.id],
    queryFn: () => api.getUserInvoices(user?.id || ""),
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAudioPlay = (invoiceId: string) => {
    setPlayingInvoice(invoiceId);
  };

  const handleAudioPause = () => {
    setPlayingInvoice(null);
  };

  return (
    <>
      {/* <UserLayout
        title="Invoices"
        description="View and manage your billing history"
      > */}
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <UserInvoiceSummary userId={user?.id} />
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>All your billing transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading invoices...</div>
            ) : invoices && invoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        #{invoice.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.plan}</p>
                          <p className="text-sm capitalize text-gray-500">
                            {invoice.billingPeriod}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${invoice.amount.toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div>{invoice.createdAt.toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        {invoice.voiceUrl ? (
                          <VoicePlayer
                            audioUrl={invoice.voiceUrl}
                            invoiceId={invoice.id}
                            className="w-56"
                          />
                        ) : (
                          <span className="text-sm text-gray-400">
                            No voice message
                          </span>
                        )}
                      </TableCell> */}
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center">
                <Receipt className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingChat />
      {/* </UserLayout> */}
    </>
  );
}
