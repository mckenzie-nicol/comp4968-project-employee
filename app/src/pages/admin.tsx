import { useEffect, useState } from "react";
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


export interface PersonProps {
  organizationId: number;
  employees: 
    { id: number; organizationId: number; firstName: string; lastName: string; email: string; }[];
}

const functionToGetAdmin = async () => {
  return { id: 1, organizationId: 1, firstName: "Bob", lastName: "Smith" };
};

const functionToGetOrganizationName = async (organizationId: number) => {
  return { organizationId, organizationName: "Example Organization Name" };
};

const functionToGetProjectManagers = async (
  organizationId: number
) => {
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

const functionToGetEmployees = async (
  organizationId: number
) => {
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
  ]};
};

function Admin() {
  const [organizationName, setOrganizationName] = useState("");
  const [projectManagers, setProjectManagers] = useState<PersonProps | null>(null);
  const [employees, setEmployees] = useState<PersonProps | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [responseMessage, setReponseMessage] = useState<string>("");

  const addUserToOrganization = async (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    const response = await fetch(
      `API_ENDPOINT/firstName=${firstName}&lastName=${lastName}&email=${email}`
    );
    if (!response.ok) {
      throw new Error("Error, unable to add user to the organization.");
    }
    const result = await response.json();
    setReponseMessage(result);
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
                  <div className="flex-col space-y-5">
                    <div className="flex-col space-y-3">
                      <label>First Name</label>
                      <Input
                        id="firstName"
                        type="firstName"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                        placeholder="First name..."
                        required
                        className="backdrop-blur-sm bg-white/50 border-gray-200"
                        />
                    </div>
                    <div className="flex-col space-y-3">
                      <label>Last Name</label>
                      <Input
                        id="lastName"
                        type="lastName"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                        placeholder="Last name..."
                        required
                        className="backdrop-blur-sm bg-white/50 border-gray-200"
                        />
                    </div>
                    <div className="flex-col space-y-3">
                      <label>Email</label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="Email..."
                        required
                        className="backdrop-blur-sm bg-white/50 border-gray-200"
                      />
                    </div>
                    <div className="flex-col space-y-3">
                      <label>Role</label>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a role..." />
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
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <DialogClose>
                <Button
                  onClick={() => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() =>
                  addUserToOrganization(firstName, lastName, email)
                }
              >
                Add Member
              </Button>
              <div id="responseMessage">{responseMessage}</div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-center space-x-6">
        <div className="w-full">
          {projectManagers && <PersonList title="Project Managers" employees={projectManagers.employees} />}
        </div>
        <div className="w-full">
          {employees && <PersonList title="Workers" employees={employees.employees} />}
        </div>
      </div>
    </>
  );
}

export default Admin;
