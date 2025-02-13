"use client";

import TimeAndDate from "./timeanddate/timeanddate";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavLinks from "./navLinks";
import { useSession } from "@/app/context/authContext";
import { useState } from "react";

const HeaderBar = () => {
  const { setTheme } = useTheme();
  const { user, loading } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section className="flex flex-col">
      <div className="fixed right-4 md:right-10 top-20 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              C
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4 md:px-8 flex gap-4 items-center justify-between">
        {loading ? (
          <span>loading</span>
        ) : (
          <div className="flex md:gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={
                  user?.userimage
                    ? `${process.env.NEXT_PUBLIC_USER_IMAGE_LOCATION}/image/user/${user?.userimage}`
                    : "/default-avatar.png"
                }
                alt={user?.name || "User Avatar"}
              />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <span className="hidden md:block">{user?.name}</span>
          </div>
        )}
        <Input
          className="w-full md:w-1/2"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <TimeAndDate />
      </div>
      <div className="flex gap-8 items-center justify-center">
        <NavLinks />
      </div>
    </section>
  );
};

export default HeaderBar;
