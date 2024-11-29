import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { PersonProps } from "@/pages/admin";

interface PersonListProps {
  title: string;
  organizationId: string,
  employees: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }[];
  setEmployees: (employees: PersonProps[]) => void;
}

const handleRemoveUserFromOrg = async (
  organizationId: string,
  userName: string
) => {
  const accessToken = sessionStorage.getItem("accessToken") || "";
  if (!userName) {
    return {
      error: "Error, missing requirements. Must have userId and role.",
    };
  }
  const body = {
    users: [
      {
        user_name: userName,
      },
    ],
  };
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations/${organizationId}/users`,
    {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Authorization": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response);
};

const PersonList = ({ organizationId, title, employees, setEmployees }: PersonListProps ) => {


  return (
    <>
      <Card className="m-4 p-4">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.first_name}</TableCell>
                    <TableCell>{employee.last_name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">Remove</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Member</DialogTitle>
                          </DialogHeader>
                          <DialogDescription>
                            Are you sure you want to remove{" "}
                            <strong>
                              {employee.first_name} {employee.last_name}
                            </strong>{" "}
                            from your organization?
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleRemoveUserFromOrg(organizationId, employee.id);
                                setEmployees(employees.filter((emp) => emp.id !== employee.id)
                                );
                              }}
                            >
                              Remove
                            </Button>
                            <DialogClose asChild>
                              <Button variant={"outline"}>Cancel</Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default PersonList;
