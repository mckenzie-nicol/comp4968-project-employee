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
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const handleRegisterUser = async (
  email: string,
  password: string,
  name: string
) => {
  if (!email || !password || !name) {
    return {
      error: "Error, missing requirements. Must have email, password and name.",
    };
  }
  const body = {
    body: {
      email: email,
      password: password,
      name: name,
    },
  };
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const data = await response.json();
    const body = JSON.parse(data.body);
    sessionStorage.setItem("userId", body.userId);
    if (response.ok) {
      console.log("Sign Up successful:", data);
      return { success: true, data };
    } else {
      console.error("Sign Up failed:", data);
      return { success: false, error: data.message || "Failed to sign in." };
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
};

const handleOrganizationSubmit = async (
  organizationName: string,
  email: string,
  password: string,
  name: string
) => {
  if (!organizationName || !email || !password || !name) {
    return {
      error: "Error, missing required fields.",
    };
  }
  const body = {
    body: {
      organizationName: organizationName,
      email: email,
      password: password,
      name: name,
    },
  };
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const data = await response.json();
    const body = JSON.parse(data.body);
    sessionStorage.setItem("organizationId", body.organizationId);
    sessionStorage.setItem("userId", body.userId);
    if (response.ok) {
      console.log("Sign Up successful:", data);
      return { success: true, data };
    } else {
      console.error("Sign Up failed:", data);
      return { success: false, error: data.message || "Failed to sign in." };
    }
  } catch (error) {
    console.error("Error during sign-up:", error);
    return { success: false, error: "An error occurred. Please try again." };
  }
};

export function SignUpForm() {
  const [isOrganization, setIsOrganization] = useState<boolean>(true);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSettingAdmin, setIsSettingAdmin] = useState<boolean>(false);
  const [checkAvailabilityResponse, setCheckAvailabilityResponse] =
    useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleCheckAvailability = async (organizationName: string) => {
    const response = await fetch(`${organizationName}`);
    const result = await response.json();
    setCheckAvailabilityResponse(result);
  };

  const onOrganizationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); // Prevent default form submission behavior
    const result = await handleOrganizationSubmit(
      organizationName,
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (result.success) {
      setError(""); // Clear error on success
      navigate("/admin");
    } else {
      setError(result.error); // Show error message
    }
  };

  const onUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const result = await handleRegisterUser(
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (result.success) {
      setError(""); // Clear error on success
      navigate("/admin");
    } else {
      setError(result.error); // Show error message
    }
  };

  return (
    <>
      <Card className="w-full max-w-md bg-white/10 border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gradient">
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-500">
            Are you signing up as an Organization? Or as an Employee?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-6 mb-4">
            <Button
              className={`${isOrganization ? "bg-slate-800" : "bg-slate-400"}`}
              onClick={() => setIsOrganization(true)}
            >
              Organization
            </Button>
            <Button
              className={`${isOrganization ? "bg-slate-400" : "bg-slate-800"}`}
              onClick={() => {
                setIsOrganization(false);
                setIsSettingAdmin(false);
              }}
            >
              Employee
            </Button>
          </div>
          <form onSubmit={onOrganizationSubmit}>
            {isOrganization && !isSettingAdmin && (
              <div className="">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Organization Name
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="Company Name..."
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <Button
                        onClick={() =>
                          handleCheckAvailability(organizationName)
                        }
                      >
                        Check Availability
                      </Button>
                      <div id="availabilityResponse">
                        {checkAvailabilityResponse}
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={() => setIsSettingAdmin(true)}>
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isOrganization && isSettingAdmin && (
              <>
                <div className="space-y-2">
                  <Button
                    className="bg-slate-800"
                    onClick={() => setIsSettingAdmin(false)}
                  >
                    <FaArrowLeft></FaArrowLeft>
                    Back
                  </Button>
                  <CardDescription className="mb-2">
                    This account will serve as the{" "}
                    <strong>sole admin/owner</strong>, responsible for managing
                    employee access, roles, and permissions within the company.
                  </CardDescription>
                  <Label htmlFor="firstName" className="text-gray-700">
                    Organization Owner First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Owner First Name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                  <Label htmlFor="lastName" className="text-gray-700">
                    Organization Owner Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Owner Last Name..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Organization Owner Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity mt-4"
                >
                  Create account
                </Button>
              </>
            )}
          </form>
          <form onSubmit={onUserSubmit}>
            {!isOrganization && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Employee Name..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Employee Name..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Employee Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity mt-4"
                >
                  Create account
                </Button>
              </>
            )}
          </form>
          {error && <div>{error}</div>}
        </CardContent>
      </Card>
    </>
  );
}
