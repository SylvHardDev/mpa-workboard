"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
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
import { useRouter } from "next/navigation";
import { auth, type AuthError } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import { getAuthError } from "@/utils/auth-errors";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erreur de validation",
        description: "Les mots de passe ne correspondent pas",
        duration: 5000,
      });
      return;
    }

    try {
      setIsLoading(true);
      await auth.resetPassword(password);
      toast({
        title: "Succès",
        description: "Votre mot de passe a été réinitialisé avec succès.",
        duration: 5000,
      });
      router.push("/login");
    } catch (error) {
      const authError = error as AuthError;
      const { message, type } = getAuthError(error);

      let title = "Erreur";
      switch (type) {
        case "WeakPassword":
          title = "Mot de passe trop faible";
          break;
        case "RateLimit":
          title = "Trop de tentatives";
          break;
        case "DatabaseError":
          title = "Erreur de base de données";
          break;
        default:
          title = "Erreur";
      }

      toast({
        title,
        description: message,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription className="text-xs">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset password
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
