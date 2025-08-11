"use client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { setCurrentUser } from "@/lib/auth";
import {
  LayoutDashboard,
  CreditCard,
  User,
  LogOut,
  Bot,
  Settings,
  Menu,
  VolumeX,
  Users,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SidebarContent from "./SidebarContent";

import { MenuItem } from "@/lib/utils/constants/types";
import { routes } from "@/lib/utils/constants";

interface SidebarContentProps {
  onItemClick?: () => void;
}

interface Props {
  isAdminSidebar?: boolean;
}

const userMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: routes.HOME,
  },
  {
    title: "Subscription",
    icon: CreditCard,
    href: routes.SUBSCRIPTION,
  },
  {
    title: "Invoices",
    icon: CreditCard,
    href: routes.INVOICES,
  },
  {
    title: "Profile",
    icon: User,
    href: routes.PROFILE,
  },
  {
    title: "Settings",
    icon: Settings,
    href: routes.SETTINGS,
  },
];

const adminMenuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: routes.ADMIN,
  },
  {
    title: "Voice Notes",
    icon: VolumeX,
    href: routes.ADMIN_VOICE_NOTES,
  },
  {
    title: "Users",
    icon: Users,
    href: routes.ADMIN_USERS,
  },
  {
    title: "Settings",
    icon: Settings,
    href: routes.ADMIN_SETTINGS,
  },
];

const Sidebar: React.FC<Props> = ({ isAdminSidebar = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sticky left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white shadow-sm lg:block">
        <SidebarContent
          menuItems={isAdminSidebar ? adminMenuItems : userMenuItems}
        />
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
          <SidebarContent
            menuItems={isAdminSidebar ? adminMenuItems : userMenuItems}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
