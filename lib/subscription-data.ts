export interface SubscriptionPackage {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalMonthlyPrice?: number;
  originalYearlyPrice?: number;
  features: string[];
  popular?: boolean;
  description: string;
  selectedBilling?: string;
  selectedPrice?: number;
}

export const subscriptionPackages: SubscriptionPackage[] = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    description: "Perfect for individuals getting started",
    features: [
      "100 voice messages per month",
      "Basic voice quality",
      "Standard support",
      "Mobile app access",
      "1 GB storage",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    originalMonthlyPrice: 29.99,
    originalYearlyPrice: 299.99,
    description: "Ideal for professionals and small teams",
    popular: true,
    features: [
      "Unlimited voice messages",
      "HD voice quality",
      "Priority support",
      "Mobile & desktop apps",
      "10 GB storage",
      "Voice transcription",
      "Custom voice filters",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    description: "For large teams and organizations",
    features: [
      "Unlimited everything",
      "Ultra HD voice quality",
      "24/7 dedicated support",
      "All platform access",
      "Unlimited storage",
      "Advanced analytics",
      "Custom integrations",
      "Team management",
      "API access",
    ],
  },
];

export interface Coupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  description: string;
}

export const availableCoupons: Coupon[] = [
  {
    code: "SAVE20",
    discount: 20,
    type: "percentage",
    description: "20% off your first month",
  },
  {
    code: "WELCOME10",
    discount: 10,
    type: "fixed",
    description: "$10 off any plan",
  },
  {
    code: "STUDENT50",
    discount: 50,
    type: "percentage",
    description: "50% student discount",
  },
];
