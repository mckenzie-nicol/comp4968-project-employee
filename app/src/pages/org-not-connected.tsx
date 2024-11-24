import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface OrgNotConnectedProps {
  onSignOut: () => void;
  setIsAuthorizedRole: (role: "admin" | "worker" | "project_manager" | null) => void;
}

const handleCheckConnection = async () => {
  try {
    const body = {
      userId: sessionStorage.getItem("userId"),
    };
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    if (data.organizationId && data.role) {
      sessionStorage.setItem("organizationId", data.organizationId);
      sessionStorage.setItem("role", data.role);
      return {
        success: true,
        message: "Successful connection detected."
      };
    } else {
      return {
        success: false,
        message: "User not connected to an organization."
      }
    }
  } catch (error) {
    console.error("An error occured while checking connection.", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}

export default function OrgNotConnected({ onSignOut, setIsAuthorizedRole }: OrgNotConnectedProps) {

  const [error, setError] = useState<string>("");

  const onCheckConnection = async () => {
    const result = await handleCheckConnection();

    if (result.success) {
      setIsAuthorizedRole(
        sessionStorage.getItem("role") as
          | "admin"
          | "worker"
          | "project_manager"
          | null
      );

    } else {
      setError(result.message || result.error || ""); // Show error message
    }
  }

    return (
      <div className="min-h-[77vh] flex-col justify-center">
        <div className="my-8">
          <h1 className="text-2xl text-center">
            You are not connected to an organization, contact the organization
            admin and check connection below.
          </h1>
        </div>
        <div className="flex space-x-8 my-8 justify-center">
          <Button
            variant="outline"
            onClick={onCheckConnection}
            className="bg-white/50 hover:bg-white/80"
          >
            Check Connection
          </Button>
          <Button
            variant="outline"
            onClick={onSignOut}
            className="bg-white/50 hover:bg-white/80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
        {error && (
          <div className="flex space-x-8 my-8 justify-center">{error}</div>
        )}
      </div>
    );
}