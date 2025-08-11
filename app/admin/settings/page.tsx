"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/lib/auth";
import { AdminLayout } from "@/components/admin-layout";
import { Settings, Save, Bell, Shield, Database } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "GanStró AI Assistant",
    siteDescription: "Advanced AI-powered voice assistant platform",
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    maxFileSize: "10",
    sessionTimeout: "30",
    apiKey: "sk-1234567890abcdef",
  });

  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "admin") {
      // router.push("/login");
    }
  }, [router]);

  const handleSave = () => {
    toast.success("Settings saved", {
      description: "Your settings have been successfully updated.",
    });
    console.log("Saving settings:", settings);
  };

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div className="space-y-6">
        {/* General Settings */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
            <CardDescription>
              Basic configuration for your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", e.target.value)
                  }
                  className="border-gray-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) =>
                    handleInputChange("maxFileSize", e.target.value)
                  }
                  className="border-gray-200 bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                rows={3}
                className="border-gray-200 bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleInputChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleInputChange("pushNotifications", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
            <CardDescription>
              Security and authentication settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange("sessionTimeout", e.target.value)
                  }
                  className="border-gray-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  className="border-gray-200 bg-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-500">
                  Enable maintenance mode for the platform
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) =>
                  handleInputChange("maintenanceMode", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card className="border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database</span>
            </CardTitle>
            <CardDescription>
              Database configuration and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                className="border-gray-200 bg-transparent"
              >
                <Database className="mr-2 h-4 w-4" />
                Backup Database
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 bg-transparent"
              >
                <Database className="mr-2 h-4 w-4" />
                Optimize Database
              </Button>
              <Button
                variant="outline"
                className="border-red-200 bg-transparent text-red-600 hover:text-red-700"
              >
                <Database className="mr-2 h-4 w-4" />
                Reset Database
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </>
  );
}
