"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2, Plus, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { primaryBtnStyles } from "@/app/commonStyles";
import { createClient } from "@/utils/supabase/client";
import { toast } from "./ui/use-toast";

export const ProfilePhotoUploader = () => {
  return (
    <div className={cn("w-fit relative")}>
      <Avatar className="w-48 h-48">
        <AvatarImage />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Only show upload button for email users */}
      <>
        <Button
          className={cn(
            primaryBtnStyles,
            "w-8 h-8 p-2 rounded-full absolute right-[-15px] top-[60%]"
          )}
        ></Button>
        <input type="file" accept="image/*" className="hidden" />
      </>
    </div>
  );
};
