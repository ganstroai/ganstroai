import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, User, Save, Loader2 } from "lucide-react";

import UserForm from "@/components/pageComponents/users/UserForm";
import Link from "next/link";
import { routes } from "@/lib/utils/constants";
import React from "react";
import { ParamsProps } from "@/lib/utils/constants/types";

const EditUserPage: React.FC<ParamsProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex w-full flex-wrap items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
            asChild
          >
            <Link href={routes.ADMIN_USERS}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-gray-600">Update user information</p>
          </div>
        </div>

        {/* Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Edit User Information</span>
            </CardTitle>
            <CardDescription>Update the user's details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm id={id} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EditUserPage;
