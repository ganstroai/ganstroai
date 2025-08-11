"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import {
  subscriptionPackages,
  type SubscriptionPackage,
} from "@/lib/subscription-data";
import { Check, Bot, LogOut, Zap, Shield } from "lucide-react";

export default function SubscriptionsPage() {
  const [selectedPackage, setSelectedPackage] =
    useState<SubscriptionPackage | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const router = useRouter();

  // useEffect(() => {
  //   const user = getCurrentUser();
  //   if (!user || user.role !== "user") {
  //     router.push("/login");
  //   }
  // }, [router]);

  const handleSelectPackage = (pkg: SubscriptionPackage) => {
    const packageWithBilling = {
      ...pkg,
      selectedBilling: billingCycle,
      selectedPrice:
        billingCycle === "monthly" ? pkg.monthlyPrice : pkg.yearlyPrice,
    };
    setSelectedPackage(packageWithBilling);
    localStorage.setItem("selectedPackage", JSON.stringify(packageWithBilling));
    // router.push("/checkout");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.href = "/login";
  };

  const getPrice = (pkg: SubscriptionPackage) => {
    return billingCycle === "monthly" ? pkg.monthlyPrice : pkg.yearlyPrice;
  };

  const getOriginalPrice = (pkg: SubscriptionPackage) => {
    return billingCycle === "monthly"
      ? pkg.originalMonthlyPrice
      : pkg.originalYearlyPrice;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-6 lg:py-8">
        <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0 lg:mb-12">
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="rounded-lg bg-primary p-2">
              <Bot className="h-6 w-6 text-white lg:h-8 lg:w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary lg:text-4xl">
                Choose Your AI Plan
              </h1>
              <p className="mt-1 text-sm text-gray-600 lg:text-base">
                Unlock advanced AI voice capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-transparent text-sm text-gray-700 lg:text-base"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <p className="mx-auto mb-6 max-w-3xl text-center text-sm text-gray-600 lg:mb-8 lg:text-lg">
          Experience next-generation AI voice assistance with our premium plans.
          Choose the perfect package for your needs.
        </p>

        {/* Billing Toggle */}
        <div className="mb-8 flex justify-center lg:mb-12">
          <Tabs
            value={billingCycle}
            onValueChange={(value) =>
              setBillingCycle(value as "monthly" | "yearly")
            }
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monthly" className="text-sm lg:text-base">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="text-sm lg:text-base">
                Yearly
                <Badge className="ml-2 bg-green-100 text-xs text-green-800">
                  Save 20%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {subscriptionPackages.map((pkg, index) => (
            <div key={pkg.id} className="relative h-full">
              <div
                className="flex h-full flex-col rounded-lg border-2 bg-white shadow-sm"
                style={{ borderColor: "#009A44" }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform lg:-top-4">
                    <Badge className="bg-primary px-4 py-1 text-xs font-semibold text-white shadow-lg lg:px-6 lg:py-2 lg:text-sm">
                      <Zap className="mr-1 h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="relative flex-shrink-0 pb-4 text-center lg:pb-6">
                  <CardTitle className="pt-5 text-xl font-bold text-gray-900 lg:text-2xl">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm lg:text-base">
                    {pkg.description}
                  </CardDescription>

                  <div className="mt-4 lg:mt-6">
                    <div className="flex items-center justify-center space-x-2">
                      {getOriginalPrice(pkg) && (
                        <span className="text-base text-gray-400 line-through lg:text-lg">
                          ${getOriginalPrice(pkg)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary lg:text-3xl">
                        ${getPrice(pkg)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 lg:text-sm">
                      per {billingCycle === "monthly" ? "month" : "year"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-grow flex-col space-y-4 px-4 lg:space-y-6 lg:px-6">
                  <ul className="flex-grow space-y-3 lg:space-y-4">
                    {pkg.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0 rounded-full bg-green-100 p-1">
                          <Check className="h-3 w-3 text-green-600 lg:h-4 lg:w-4" />
                        </div>
                        <span className="text-xs font-medium lg:text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Button
                      className="h-10 w-full bg-primary text-sm text-white hover:bg-primary/90 lg:h-12 lg:text-base"
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      Choose {pkg.name}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center lg:mt-12">
          <div className="inline-flex items-center space-x-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 lg:px-6 lg:py-3">
            <Shield className="h-4 w-4 flex-shrink-0 text-primary lg:h-5 lg:w-5" />
            <p className="text-xs text-gray-600 lg:text-sm">
              14-day free trial • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
