"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import {
  availableCoupons,
  type SubscriptionPackage,
  type Coupon,
} from "@/lib/subscription-data";
import { CreditCard, ShoppingCart, Tag, ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  cardNumber: z.string().min(16, "Card number is required"),
  expiryDate: z.string().min(5, "Expiry date is required"),
  cvv: z.string().min(3, "CVV is required"),
  name: z.string().min(2, "Name is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">(
    "stripe",
  );
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "user") {
      // router.push("/login");
      return;
    }

    const packageData = localStorage.getItem("selectedPackage");
    if (packageData) {
      setSelectedPackage(JSON.parse(packageData));
    } else {
      // router.push("/subscriptions");
    }

    setValue("email", user.email);
  }, [router, setValue]);

  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase(),
    );
    if (coupon) {
      setAppliedCoupon(coupon);
      toast.success("Coupon applied!", {
        description: coupon.description,
      });
    } else {
      toast.error("Invalid coupon", {
        description: "The coupon code you entered is not valid.",
      });
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const calculateTotal = () => {
    if (!selectedPackage) return 0;

    let basePrice = 0;
    if (selectedPackage.selectedBilling === "yearly") {
      basePrice =
        selectedPackage.yearlyPrice || selectedPackage.selectedPrice || 0;
    } else {
      basePrice =
        selectedPackage.monthlyPrice || selectedPackage.selectedPrice || 0;
    }

    let total = basePrice;

    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        total = total * (1 - appliedCoupon.discount / 100);
      } else {
        total = Math.max(0, total - appliedCoupon.discount);
      }
    }

    return total;
  };

  const getDisplayPrice = () => {
    if (!selectedPackage) return 0;

    if (selectedPackage.selectedBilling === "yearly") {
      return selectedPackage.yearlyPrice || selectedPackage.selectedPrice || 0;
    } else {
      return selectedPackage.monthlyPrice || selectedPackage.selectedPrice || 0;
    }
  };

  const getBillingText = () => {
    if (!selectedPackage) return "month";
    return selectedPackage.selectedBilling === "yearly" ? "year" : "month";
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      const user = getCurrentUser();
      if (user && selectedPackage) {
        const updatedUser = {
          ...user,
          subscription: {
            plan: selectedPackage.name,
            status: "active" as const,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        };
        setCurrentUser(updatedUser);

        toast.success("Payment successful!", {
          description: `Welcome to ${selectedPackage.name} plan!`,
        });

        // Redirect to user dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
      setIsProcessing(false);
    }, 2000);
  };

  // if (!selectedPackage) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          {/* Order Summary */}
          <Card className="border-2" style={{ borderColor: "#009A44" }}>
            <CardHeader>
              <CardTitle className="text-primary">Order Summary</CardTitle>
              <CardDescription>
                Review your selected plan and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedPackage?.name} Plan
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getBillingText() === "year" ? "Yearly" : "Monthly"}{" "}
                    subscription
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ${getDisplayPrice().toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    per {getBillingText()}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Coupon Section */}
              <div className="space-y-3">
                <Label className="font-semibold text-gray-900">
                  Coupon Code
                </Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {appliedCoupon.code}
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {appliedCoupon.description}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="border-2 border-gray-200 focus:border-primary"
                    />
                    <Button
                      variant="outline"
                      onClick={applyCoupon}
                      className="border-primary bg-transparent text-primary hover:bg-primary hover:text-white"
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-medium text-primary">
                    ${getDisplayPrice().toFixed(2)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>
                      -
                      {appliedCoupon.type === "percentage"
                        ? `${appliedCoupon.discount}%`
                        : `$${appliedCoupon.discount}`}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm text-primary">
                  💡 Available coupon codes: SAVE20, WELCOME10, STUDENT50
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="border-2" style={{ borderColor: "#009A44" }}>
            <CardHeader>
              <CardTitle className="text-primary">
                Payment Information
              </CardTitle>
              <CardDescription>
                Choose your payment method and enter details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <Label className="font-semibold text-gray-900">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "stripe" ? "default" : "outline"
                      }
                      onClick={() => setPaymentMethod("stripe")}
                      className={`flex items-center justify-center space-x-2 ${
                        paymentMethod === "stripe"
                          ? "bg-primary text-white"
                          : "border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card</span>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "paypal" ? "default" : "outline"
                      }
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex items-center justify-center space-x-2 ${
                        paymentMethod === "paypal"
                          ? "bg-primary text-white"
                          : "border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>PayPal</span>
                    </Button>
                  </div>
                </div>

                {paymentMethod === "stripe" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cardNumber"
                          className="font-medium text-gray-900"
                        >
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="border-2 border-gray-200 focus:border-primary"
                          {...register("cardNumber")}
                        />
                        {errors.cardNumber && (
                          <p className="text-sm text-red-600">
                            {errors.cardNumber.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="font-medium text-gray-900"
                        >
                          Cardholder Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="border-2 border-gray-200 focus:border-primary"
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="expiryDate"
                          className="font-medium text-gray-900"
                        >
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          className="border-2 border-gray-200 focus:border-primary"
                          {...register("expiryDate")}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-600">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="cvv"
                          className="font-medium text-gray-900"
                        >
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="border-2 border-gray-200 focus:border-primary"
                          {...register("cvv")}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-600">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "paypal" && (
                  <div className="rounded-lg border-2 border-dashed border-primary/30 bg-gray-50 p-6 text-center">
                    <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-primary" />
                    <p className="text-gray-600">
                      You will be redirected to PayPal to complete your payment
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-900">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="border-2 border-gray-200 focus:border-primary"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full bg-primary text-lg font-semibold text-white hover:bg-primary/90"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Pay $${calculateTotal().toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
