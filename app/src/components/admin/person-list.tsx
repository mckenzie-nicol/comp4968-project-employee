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

interface PersonListProps {
  title: string;
  organizationId: number,
  employees: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

const handleRemoveUserFromOrg = async (
  organizationId: number,
  email: string
) => {
  if (!email) {
    return {
      error: "Error, missing requirements. Must have userId and role.",
    };
  }
  const body = {
    users: [
      {
        email: email,
      },
    ],
  };
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/prod/organizations/${organizationId}/users`,
    {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response);
};

const PersonList = ({ organizationId, title, employees }: PersonListProps ) => {



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
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
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
                              {employee.firstName} {employee.lastName}
                            </strong>{" "}
                            from your organization?
                          </DialogDescription>
                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleRemoveUserFromOrg(organizationId, employee.email);
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
