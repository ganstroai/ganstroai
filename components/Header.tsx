"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeLoggedUser } from "@/lib/actions/auth";
import { useAtom } from "jotai";
import { loggedUserAtom } from "@/lib/store";
import { routes } from "@/lib/utils/constants";

const Header = () => {
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom);

  const router = useRouter();

  const handleLogout = async () => {
    setLoggedUser(null);
    await removeLoggedUser();
    router.push(routes.LOGIN);
  };

  return (
    <>
      <header className="sticky top-0 ml-0 flex h-[77px] items-center justify-end border-b border-gray-200 bg-white px-4 py-3 lg:ml-0 lg:px-6 lg:py-4">
        <div className="ml-12 flex items-center justify-between lg:ml-0">
          {/* <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
              {description && <p className="text-sm lg:text-base text-gray-600 mt-1">{description}</p>}
            </div> */}

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>
                      {((loggedUser as any)?.user?.firstName || "")
                        ?.slice(0, 2)
                        ?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {`${(loggedUser as any)?.user?.firstName || ""} ${(loggedUser as any)?.user?.lastName || ""}`}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {(loggedUser as any)?.user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
