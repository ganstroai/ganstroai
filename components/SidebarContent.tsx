import { MenuItem } from "@/lib/utils/constants/types";
import { Bot } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  menuItems: MenuItem[];
}

const SidebarContent: React.FC<Props> = ({ menuItems }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    //   setCurrentUser(null);
    document.cookie =
      "currentUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="border-b border-gray-200 px-6 py-4">
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
            const Icon: any = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm lg:h-auto lg:text-base ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="mr-2 h-4 w-4 lg:mr-3" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SidebarContent;
