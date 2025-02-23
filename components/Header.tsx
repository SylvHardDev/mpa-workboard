import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          href={"/"}
          className="flex items-center space-x-2 font-bold text-xl hover:text-primary transition-colors"
        >
          MPA workboard
        </Link>
        <div className="flex items-center gap-4">
          <UserMenu />
          <div className="border-l pl-4 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
