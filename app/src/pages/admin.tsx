import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PersonList from "@/components/admin/person-list";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export interface PersonProps {
  organizationId: number;
  employees: {
    id: number;
    organizationId: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const functionToGetAdmin = async () => {
  return { id: 1, organizationId: 1, firstName: "Bob", lastName: "Smith" };
};

const functionToGetOrganizationName = async (organizationId: number) => {
  return { organizationId, organizationName: "Example Organization Name" };
};

const functionToGetProjectManagers = async (organizationId: number) => {
  return {
    organizationId: organizationId,
    employees: [
      {
        id: 2,
        organizationId: 1,
        firstName: "Tim",
        lastName: "Jones",
        email: "timjones@exampleOrg.com",
      },
      {
        id: 3,
        organizationId: 1,
        firstName: "Rob",
        lastName: "Jones",
        email: "robjones@exampleOrg.com",
      },
      {
        id: 4,
        organizationId: 1,
        firstName: "Rick",
        lastName: "Jones",
        email: "rickjones@exampleOrg.com",
      },
      {
        id: 5,
        organizationId: 1,
        firstName: "Ted",
        lastName: "Jones",
        email: "tedjones@exampleOrg.com",
      },
    ],
  };
};

const functionToGetEmployees = async (organizationId: number) => {
  return {
    organizationId: organizationId,
    employees: [
      {
        id: 6,
        organizationId: 1,
        firstName: "Tim",
        lastName: "Jones",
        email: "timjones@exampleOrg.com",
      },
      {
        id: 7,
        organizationId: 1,
        firstName: "Rob",
        lastName: "Jones",
        email: "robjones@exampleOrg.com",
      },
      {
        id: 8,
        organizationId: 1,
        firstName: "Rick",
        lastName: "Jones",
        email: "rickjones@exampleOrg.com",
      },
      {
        id: 9,
        organizationId: 1,
        firstName: "Ted",
        lastName: "Jones",
        email: "tedjones@exampleOrg.com",
      },
    ],
  };
};

const handleAddUserToOrg = async (
  organizationId: number,
  email: string,
  role: string
) => {
  if (!email || !role) {
    return {
      error: "Error, missing requirements. Must have userId and role.",
    };
  }
  const body = {
    users: [
      {
        email: email,
        role: role,
      },
    ],
  };
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/prod/organizations/${organizationId}/users`,
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
    if (response.ok) {
      console.log("Login successful:", data);
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

function Admin() {
  const [organizationName, setOrganizationName] = useState("");
  const [projectManagers, setProjectManagers] = useState<PersonProps | null>(
    null
  );
  const [employees, setEmployees] = useState<PersonProps | null>(null);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const organizationId = Cookies.get("organizationId") || "";

  if (!organizationId) {
    navigate('/');
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const result = await handleAddUserToOrg(
      parseInt(organizationId),
      email,
      role
    );

    if (result.success) {
      setError(""); // Clear error on success
      navigate("/admin");
    } else {
      setError(result.error); // Show error message
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const admin = await functionToGetAdmin();
      const organization = await functionToGetOrganizationName(
        admin.organizationId
      );
      const managers = await functionToGetProjectManagers(admin.organizationId);
      const empList = await functionToGetEmployees(admin.organizationId);

      setOrganizationName(organization.organizationName);
      setProjectManagers(managers);
      setEmployees(empList);
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-between mx-20 my-10">
        <h1 className="text-3xl font-bold">{organizationName}</h1>
        <Dialog>
          <DialogTrigger>
            <Button variant={"default"}>Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="flex-col space-y-10">
                <DialogTitle>Add a member to your organization...</DialogTitle>
                <DialogDescription>
                  <form onSubmit={onSubmit}>
                    <div className="flex-col space-y-5">
                      <div className="flex-col space-y-3">
                        <label>Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEmail(e.target.value)
                          }
                          placeholder="Email..."
                          required
                          className="backdrop-blur-sm bg-white/50 border-gray-200"
                        />
                      </div>
                      <div className="flex-col space-y-3">
                        <label>Role</label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setRole(e.target.value)}
                              placeholder="Select a role..."
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="projectManager">
                                Project Manager
                              </SelectItem>
                              <SelectItem value="worker">Worker</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <DialogClose>
                <Button
                  onClick={() => {
                    setEmail("");
                    setRole("");
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity"
              >
                Add Member
              </Button>
              {error && (
                <div>{error}</div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="xl:flex xl:justify-center xl:space-x-2">
        <div className="w-full">
          {projectManagers && (
            <PersonList
              organizationId={parseInt(organizationId)}
              title="Project Managers"
              employees={projectManagers.employees}
            />
          )}
        </div>
        <div className="w-full">
          {employees && (
            <PersonList
              organizationId={parseInt(organizationId)}
              title="Workers"
              employees={employees.employees}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
