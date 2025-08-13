import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, UserPlus, Save, Loader2, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ADMIN_USERS_URL, routes } from "@/lib/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { createAndUpdateGenericAction } from "@/lib/actions";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import UserForm from "@/components/pageComponents/users/UserForm";

export default function AddUserPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex w-full flex-wrap items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={routes.ADMIN_USERS}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
          <p className="text-gray-600">Create a new user account</p>
        </div>
      </div>

      {/* Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new user account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
