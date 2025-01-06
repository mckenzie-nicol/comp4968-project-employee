// src/components/auth/sign-in-form.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockUsers } from "@/mockData/users";
// If using localStorage, you could do:
// import { getLocalUsers } from "@/utils/localStorageUtils";

interface SignInProps {
  setIsAuthenticated: (state: boolean) => void;
}

function handleSignIn(email: string, password: string) {
  // const storedUsers = getLocalUsers(); // localStorage
  const storedUsers = mockUsers; // in-memory

  const foundUser = storedUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  // Mock tokens
  sessionStorage.setItem("accessToken", "MOCK_ACCESS_TOKEN");
  sessionStorage.setItem("refreshToken", "MOCK_REFRESH_TOKEN");
  sessionStorage.setItem("userId", foundUser.email);

  if (foundUser.organizationId) {
    sessionStorage.setItem("organizationId", foundUser.organizationId);
  }
  sessionStorage.setItem("role", foundUser.role);

  return {
    success: true,
    data: foundUser,
  };
}

export function SignInForm({ setIsAuthenticated }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = handleSignIn(email, password);

    if (result.success) {
      setError("");
      setIsAuthenticated(true);
    } else {
      setError(result.error || "");
    }
  };

  return (
    <Card className="w-full max-w-md bg-background border-0 dark:shadow-gray-950">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription className="text-gray-500 dark:text-secondary">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="backdrop-blur-sm dark:border-2 focus:border-black focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="backdrop-blur-sm dark:border-2 focus:border-black focus:ring-black"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full bg-primary hover:opacity-95">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
