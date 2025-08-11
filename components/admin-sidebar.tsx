"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { setCurrentUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bot,
  VolumeX,
  Menu,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Voice Notes",
    icon: VolumeX,
    href: "/admin/voice-notes",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
];

interface SidebarContentProps {
  onItemClick?: () => void;
}

function SidebarContent({ onItemClick }: SidebarContentProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
    onItemClick?.();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="border-b border-gray-200 p-4 lg:p-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-primary p-2">
            <Bot className="h-5 w-5 text-white lg:h-6 lg:w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 lg:text-lg">
              GanStró AI
            </h1>
            <p className="text-xs text-gray-500">Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 lg:space-y-2 lg:p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm lg:h-auto lg:text-base ${
                isActive
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="mr-2 h-4 w-4 lg:mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-3 border-t border-gray-200 p-3 lg:p-4">
        <Button
          variant="outline"
          className="h-10 w-full border-red-200 bg-transparent text-sm text-red-600 hover:bg-red-50 hover:text-red-700 lg:h-auto lg:text-base"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 bg-white shadow-md lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">menu</SheetTitle>
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
