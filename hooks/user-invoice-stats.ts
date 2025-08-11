import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function userInvoiceStats(userId?: string) {
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["invoices", userId],
    enabled: !!userId,
    queryFn: () => api.getUserInvoices(userId!),
  });

  const totalAmount = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0)
    .toFixed(2);

  const totalInvoices = invoices.length;

  return {
    invoices,
    totalAmount,
    totalInvoices,
    isLoading,
  };
}
