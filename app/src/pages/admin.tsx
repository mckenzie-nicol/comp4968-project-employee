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

// ---- LOCAL ONLY: no refreshTokens import needed ----
// import refreshTokens from "@/actions/refresh-token";

import { mockUsers } from "@/mockData/users";
// Optional: If you created mockOrganizations.ts, import them:
// import { mockOrganizations } from "@/mockData/organizations";

export interface PersonProps {
  id: string; // We'll store the user's email as their "id"
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface AdminProps {
  onSignOut: () => void;
}

function Admin({ onSignOut }: AdminProps) {
  const [organizationName, setOrganizationName] = useState("");
  const [projectManagers, setProjectManagers] = useState<PersonProps[]>([]);
  const [employees, setEmployees] = useState<PersonProps[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [response, setResponse] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const organizationId = sessionStorage.getItem("organizationId") || "";
  const userRole = sessionStorage.getItem("role");

  // 1) If not an admin or no org ID, redirect (like your old code).
  useEffect(() => {
    // If you want to ensure only Admin can see this
    if (userRole !== "admin" || !organizationId) {
      navigate("/");
      return;
    }
  }, [userRole, organizationId, navigate]);

  // 2) On load (and whenever `isOpen` changes), load local org name and separate users
  useEffect(() => {
    // Hard-code or look up from a "mockOrganizations" file:
    // For example:
    if (organizationId === "org-1") {
      setOrganizationName("Acme Inc.");
    } else if (organizationId === "org-2") {
      setOrganizationName("Next Gen Solutions");
    } else {
      setOrganizationName("Unknown Organization");
    }

    // Now gather all local users who belong to this org
    const orgUsers = mockUsers.filter(
      (u) => u.organizationId === organizationId
    );

    // Separate project managers from workers
    const pms: PersonProps[] = [];
    const workers: PersonProps[] = [];

    orgUsers.forEach((user) => {
      // We'll guess first/last name by splitting user.name
      const [fname, lname = ""] = user.name.split(" ");
      if (user.role === "project_manager") {
        pms.push({
          id: user.email,
          first_name: fname,
          last_name: lname,
          email: user.email,
          role: user.role,
        });
      } else if (user.role === "worker") {
        workers.push({
          id: user.email,
          first_name: fname,
          last_name: lname,
          email: user.email,
          role: user.role,
        });
      }
    });

    setProjectManagers(pms);
    setEmployees(workers);
  }, [organizationId, isOpen]);

  // 3) Local "Add user to org" logic
  //    - We locate them in mockUsers by email
  //    - If found, we set their orgId + role
  //    - If not found, show error
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResponse("");

    if (!email || !role) {
      setResponse("Error: missing user email or role.");
      return;
    }

    const existingUser = mockUsers.find((u) => u.email === email);
    if (!existingUser) {
      setResponse(
        "User not found, please verify user is signed up and the email is correct."
      );
      return;
    }

    // If found, update their organizationId and role
    existingUser.organizationId = organizationId;
    // "project_manager" or "worker"
    existingUser.role = role as "project_manager" | "worker";

    setResponse("Successfully added user to organization!");
    setEmail("");
    setRole("");

    // Close the dialog & refresh
    setIsOpen(false);
  };

  return (
    <div className="min-h-[71vh] flex flex-col justify-center">
      <div className="flex justify-between mx-20 my-10">
        <h1 className="text-3xl font-bold">{organizationName}</h1>
        <div className="space-x-4">
          {/* Add Member Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                      className="backdrop-blur-sm"
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
                      className="bg-primary hover:opacity-90"
                    >
                      Add Member
                    </Button>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          setEmail("");
                          setRole("");
                        }}
                        className="bg-secondary hover:opacity-90"
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

          {/* Sign Out */}
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

      {/* List of PMs and Employees */}
      <div className="xl:flex xl:justify-center xl:space-x-2">
        <div className="w-full">
          <PersonList
            organizationId={organizationId}
            title="Project Managers"
            employees={projectManagers}
            setEmployees={setProjectManagers}
          />
        </div>
        <div className="w-full">
          <PersonList
            organizationId={organizationId}
            title="Workers"
            employees={employees}
            setEmployees={setEmployees}
          />
        </div>
      </div>
    </div>
  );
}

export default Admin;
