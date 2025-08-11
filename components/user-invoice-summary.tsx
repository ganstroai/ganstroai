import { userInvoiceStats } from "@/hooks/user-invoice-stats";
import { Card, CardContent } from "./ui/card";
import { Newspaper, Receipt } from "lucide-react";

type Props = {
  userId?: string;
};

export function UserInvoiceSummary({ userId }: Props) {
  const { totalAmount, totalInvoices, isLoading } = userInvoiceStats(userId);

  if (isLoading) return <p>Loading invoice stats...</p>;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                $ {totalAmount || "0.00"}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Receipt className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Invoices
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalInvoices || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Newspaper className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">This month</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
