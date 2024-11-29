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

const handleSignIn = async (email: string, password: string) => {

  

  if (!email || !password) {
    return {
      error: "Error, missing requirements. Must have email and password.",
    };
  }
  const body = {
    body: {
      username: email,
      password: password,
    },
  };

  try {
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    const parseBody = JSON.parse(data.body);
    console.log(parseBody);
    if (response.ok) {
      // Example of setting a secure, HTTP-only cookie
      sessionStorage.setItem("accessToken", parseBody.tokens.accessToken);
      sessionStorage.setItem("refreshToken", parseBody.tokens.refreshToken);
      sessionStorage.setItem("userId", parseBody.user.Username);
      console.log("Login successful:", data);

      const accessToken = sessionStorage.getItem("accessToken") || "";

      try {
        const body = {
            userId: parseBody.user.Username,
        };
        const response = await fetch(
          `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Authorization": accessToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        console.log(data);
        if (!data.error) {
          sessionStorage.setItem("organizationId", data.organizationId);
          sessionStorage.setItem("role", data.role);
        } 
      } catch (error) {
        console.error("User not connected to organization:", error);
        return {
          success: false,
          error: "An error occurred. Please try again.",
        };
      }

      return { success: true, data };
    } else {
      console.error("Login failed:", data);
      return { success: false, error: data.message || "Failed to sign in." };
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
};

interface SignInProps {
  setIsAuthenticated: (state: boolean) => void;
}

export function SignInForm({ setIsAuthenticated }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const result = await handleSignIn(email, password);

    if (result.success) {
      setError(""); // Clear error on success
      setIsAuthenticated(true);
    } else {
      setError(result.error); // Show error message
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/10 border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gradient">
          Sign in
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity"
          >
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
