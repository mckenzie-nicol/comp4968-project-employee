import { useState, useEffect } from "react";
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
import { LogOut } from "lucide-react";

export interface PersonProps {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

const functionToGetAdmin = async () => {
  return { id: 1, organizationId: 1, firstName: "Bob", lastName: "Smith" };
};

const functionToGetOrganizationName = async (organizationId: number) => {
  return { organizationId, organizationName: "Example Organization Name" };
};

const getUsersForOrganization = async (organizationId: string) => {
  try {

    const accessToken = sessionStorage.getItem("accessToken") || "";

    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations/${organizationId}/users`,
      {
        method: "GET",
        headers: {
          "Authorization": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Failed to add user." };
    }
  } catch (error) {
    return {
      success: false,
      error: `An error occurred - ${error}. Please try again.`,
    };
  }
};

const handleAddUserToOrg = async (
  organizationId: string,
  email: string,
  role: string
) => {
  if (!email || !role) {
    return { error: "Error, missing requirements. Must have email and role." };
  }
  const body = {
    users: [
      {
        email,
        role,
      },
    ],
  };
  try {
    const response = await fetch(
      `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations/${organizationId}/users`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Failed to add user." };
    }
  } catch (error) {
    return { success: false, error: `An error occurred - ${error}. Please try again.` };
  }
};

interface AdminProps {
  onSignOut : () => void;
}

function Admin({ onSignOut }: AdminProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [projectManagers, setProjectManagers] = useState<PersonProps[] | null>(
    null
  );
  const [employees, setEmployees] = useState<PersonProps[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [response, setResponse] = useState("");

  const navigate = useNavigate();
  const organizationId = sessionStorage.getItem("organizationId") || "";

  useEffect(() => {
    if (!organizationId) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      const admin = await functionToGetAdmin();
      const organization = await functionToGetOrganizationName(
        admin.organizationId
      );

      const employees = await getUsersForOrganization(organizationId);

      const workers: PersonProps[] = [];
      const projectManagers: PersonProps[] = [];

      employees.data.results.forEach((employee: PersonProps) => {
        if (employee.role === "worker") {
          workers.push(employee);
        } else if (employee.role === "project_manager") {
          projectManagers.push(employee);
        }
      });

      setOrganizationName(organization.organizationName);
      setProjectManagers(projectManagers);
      setEmployees(workers);
    };

    fetchData();
  }, [organizationId, navigate]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await handleAddUserToOrg(organizationId, email, role);

    console.log(result.data.results.notFound);
    
    if (result.success && result.data.results.notFound === 0) {
      setResponse("Successfully Added User to Organization!");
      setEmail("");
      setRole("");
      navigate("/admin");
    } else if (result.data.results.notFound > 0) {
      setResponse(
        "User not found, please verify user is signed up and correctness of submitted email."
      );
    } else {
      setResponse(result.error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mx-20 my-10">
        <h1 className="text-3xl font-bold">{organizationName}</h1>
        <div className="space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Add Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a member to your organization...</DialogTitle>
                <DialogDescription>
                  Fill out the details below to invite a member.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit}>
                <div className="flex-col space-y-5">
                  <div className="flex-col space-y-3">
                    <label>Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email..."
                      required
                      className="backdrop-blur-sm bg-white/50 border-gray-200"
                    />
                  </div>
                  <div className="flex-col space-y-3">
                    <label>Role</label>
                    <Select
                      onValueChange={(value) => setRole(value)}
                      value={role}
                      required
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="project_manager">
                            Project Manager
                          </SelectItem>
                          <SelectItem value="worker">Worker</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-black via-gray-800 to-black hover:opacity-90 transition-opacity"
                      onClick={() => {}}
                    >
                      Add Member
                    </Button>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          setEmail("");
                          setRole("");
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </form>
              {response && <div className="mt-4">{response}</div>}
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            onClick={onSignOut}
            className="bg-white/50 hover:bg-white/80"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
      <div className="xl:flex xl:justify-center xl:space-x-2">
        <div className="w-full">
          {projectManagers && (
            <PersonList
              organizationId={organizationId}
              title="Project Managers"
              employees={projectManagers}
              setEmployees={setProjectManagers}
            />
          )}
        </div>
        <div className="w-full">
          {employees && (
            <PersonList
              organizationId={organizationId}
              title="Workers"
              employees={employees}
              setEmployees={setEmployees}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
