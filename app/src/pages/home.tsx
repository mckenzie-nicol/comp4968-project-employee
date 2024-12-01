import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import OrgNotConnected from "./org-not-connected";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Admin from "./admin";

function Home() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorizedRole, setIsAuthorizedRole] = useState<
    "admin" | "worker" | "project_manager" | null
  >(null);

  const handleSignOut = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("organizationId");
    sessionStorage.removeItem("role");
    setIsAuthenticated(false);
    setIsAuthorizedRole(null);
  };

  useEffect(() => {
    if (
      sessionStorage.getItem("accessToken") &&
      sessionStorage.getItem("refreshToken") &&
      sessionStorage.getItem("userId")
    ) {
      setIsAuthenticated(true);
    }
    if (isAuthenticated && sessionStorage.getItem("organizationId")) {
      switch (sessionStorage.getItem("role")) {
        case "worker":
        case "project_manager":
        case "admin":
          setIsAuthorizedRole(
            sessionStorage.getItem("role") as
              | "admin"
              | "worker"
              | "project_manager"
              | null
          );
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, isAuthorizedRole]);

  if (isAuthenticated && isAuthorizedRole === 'worker' || isAuthorizedRole === 'project_manager') {
    return (
      <DashboardPage
        onSignOut={handleSignOut}
        userRole={isAuthorizedRole}
      />
    );
  } else if (isAuthenticated && isAuthorizedRole === 'admin') {
    return <Admin onSignOut={handleSignOut} />;
  } else if (isAuthenticated && !sessionStorage.getItem("organizationId")) {
    return <OrgNotConnected onSignOut={handleSignOut} setIsAuthorizedRole={setIsAuthorizedRole} />;
  }
  return (
    <div className="min-h-[77vh] auth-container">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 mt-8">
            Timesheet Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-secondary bg-clip-text">
            Manage your time, track your projects
          </p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-40rem)]">
          <div className="form-container glass-effect p-1 rounded-xl card-glow">
            {isSignIn ? (
              <SignInForm setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <SignUpForm setHidden={setIsSignIn} />
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4 dark:text-secondary">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSignIn(!isSignIn)}
              className="min-w-[200px] bg-background hover:opacity-95 transition-all duration-300"
            >
              {isSignIn ? "Create account" : "Sign in"}
            </Button>
            <br /><br />
            <Card className="bg-white/10 border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium text-gray-600">
                  Sign In Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-left">
                  <h3 className="mb-2">All passwords: Password123@</h3>
                  <ul className="">
                    <li>Kate - ksullivan33@my.bcit.ca - Admin</li>
                    <li>Reza - rhedieloo@my.bcit.ca - PM</li>
                    <li>Grace - isu4@my.bcit.ca - PM</li>
                    <li>Mckenzie - mnicol11@my.bcit.ca - Worker</li>
                    <li>Charlie - czhang177@my.bcit.ca - Worker</li>
                    <li>Colin - cchan535@my.bcit.ca - Worker</li>
                    <li>Jake - jcurrie42@my.bcit.ca - Worker</li>
                    <li>Marco - mho122@my.bcit.ca - Worker</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
