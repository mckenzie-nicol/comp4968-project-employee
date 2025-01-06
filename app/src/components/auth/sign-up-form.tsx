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
import { mockUsers } from "@/mockData/users";
// If you want localStorage, import:
// import { getLocalUsers, setLocalUsers } from "@/utils/localStorageUtils";

interface SignUpProps {
  setHidden: (hidden: boolean) => void;
}

export function SignUpForm({ setHidden }: SignUpProps) {
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

  // If you'd like to "check" org names, you can do so here. This is a mock.
  const handleCheckAvailability = (orgName: string) => {
    // Mock logic: always available
    setCheckAvailabilityResponse(`"${orgName}" is available.`);
  };

  function handleRegisterUser(
    email: string,
    password: string,
    name: string,
    role: "admin" | "worker" | "project_manager",
    orgId?: string
  ) {
    // If localStorage:
    // let storedUsers = getLocalUsers();
    const storedUsers = mockUsers; // in-memory

    if (storedUsers.some((u) => u.email === email)) {
      return {
        success: false,
        error: "A user with that email already exists.",
      };
    }

    const newUser = {
      email,
      password,
      name,
      role,
      organizationId: orgId,
    };
    storedUsers.push(newUser);

    // If localStorage:
    // setLocalUsers(storedUsers);

    return { success: true, data: newUser };
  }

  const onOrganizationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // We'll mock creation of a new org with ID "org-2"
    const result = handleRegisterUser(
      email,
      password,
      `${firstName} ${lastName}`,
      "admin",
      "org-2"
    );

    if (result.success) {
      setError("");
      alert(
        "Organization and user signed up! (Mock). Check your 'email' for verification."
      );
      setHidden(true);
    } else {
      setError(result.error || "");
    }
  };

  const onUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // We'll sign them up as a "worker" with no org or a default.
    const result = handleRegisterUser(
      email,
      password,
      `${firstName} ${lastName}`,
      "worker"
    );

    if (result.success) {
      setError("");
      alert("User signed up! (Mock). Check your 'email' for verification.");
      setHidden(true);
    } else {
      setError(result.error || "");
    }
  };

  return (
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

        {/* ORGANIZATION FORM */}
        {isOrganization && (
          <form onSubmit={onOrganizationSubmit}>
            {!isSettingAdmin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organizationName" className="text-gray-700">
                    Organization Name
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="ABC Corp..."
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="space-y-6 mt-4">
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => handleCheckAvailability(organizationName)}
                    >
                      Check Availability
                    </Button>
                    <div id="availabilityResponse">
                      {checkAvailabilityResponse}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      onClick={() => setIsSettingAdmin(true)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </>
            )}

            {isSettingAdmin && (
              <>
                <div className="space-y-2">
                  <Button
                    type="button"
                    className="bg-slate-800"
                    onClick={() => setIsSettingAdmin(false)}
                  >
                    <FaArrowLeft />
                    Back
                  </Button>
                  <CardDescription className="mb-2">
                    This account will serve as the{" "}
                    <strong>sole admin/owner</strong>.
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
                <div className="space-y-2 mt-4">
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
                <div className="space-y-2 mt-4">
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
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity mt-4"
                >
                  Create account
                </Button>
              </>
            )}
          </form>
        )}

        {/* EMPLOYEE FORM */}
        {!isOrganization && (
          <form onSubmit={onUserSubmit}>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="Employee First Name..."
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="lastName" className="text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Employee Last Name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="email" className="text-gray-700">
                Employee Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="backdrop-blur-sm bg-white/50 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
            <div className="space-y-2 mt-4">
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity mt-4"
            >
              Create account
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
