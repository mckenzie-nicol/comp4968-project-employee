// src/pages/Home.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockUsers } from "@/mockData/users";
import { DashboardPage } from "@/components/dashboard/dashboard-page"; // or wherever your DashboardPage is
import Admin from "./admin"; // if you have an admin page
// SignIn / SignUp forms if you have them, or keep it all in one.

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<
    "admin" | "worker" | "project_manager" | null
  >(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    // Look up user in mock data
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) {
      setError("Invalid credentials");
      return;
    }
    setIsAuthenticated(true);
    setUserRole(foundUser.role);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setEmail("");
    setPassword("");
    setError("");
  };

  // Once authenticated, show Dashboard or Admin
  if (isAuthenticated) {
    if (userRole === "admin") {
      return <Admin onSignOut={handleSignOut} />;
    } else {
      // worker or PM
      return (
        <DashboardPage
          onSignOut={handleSignOut}
          userRole={userRole || "worker"}
        />
      );
    }
  }

  // Otherwise, show sign-in form
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm bg-white/10 border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Sign In (Local)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label>Email</label>
              <input
                className="border w-full p-2 rounded"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                className="border w-full p-2 rounded"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Button onClick={handleSignIn} className="w-full">
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
      <br />
      <br />
      <Card className="bg-white/10 border-0">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-600">
            Sign In Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-left">
            <h3 className="mb-2">All passwords: Password123@</h3>
            <ul>
              <li>Alice - alice@company.com - Admin</li>
              <li>Bob - bob@company.com - Project Manager</li>
              <li>Charlie - charlie@company.com - Project Manager</li>
              <li>Devon - devon@company.com - Worker</li>
              <li>Emily - emily@company.com - Worker</li>
              <li>Frank - frank@company.com - Worker</li>
              <li>Gina - gina@company.com - Worker</li>
              <li>Harry - harry@company.com - Worker</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;
