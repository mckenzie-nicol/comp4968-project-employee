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

// We'll access the same mock data to "remove" the user from the org
import { mockUsers } from "@/mockData/users";
// If using localStorage, import getLocalUsers/setLocalUsers similarly

interface PersonListProps {
  title: string;
  organizationId: string;
  employees: PersonProps[];
  setEmployees: (employees: PersonProps[]) => void;
}

const PersonList = ({
  organizationId,
  title,
  employees,
  setEmployees,
}: PersonListProps) => {
  // "Remove from org" simply sets user.organizationId to undefined (or ""), then
  // filters them out from the local list
  const handleRemoveUserFromOrg = (userId: string) => {
    const user = mockUsers.find((u) => u.email === userId);
    if (user) {
      user.organizationId = undefined; // or ""
      // Maybe reset their role to "worker" or do nothing
      // user.role = "worker";
    }
    // Then remove them from local state
    setEmployees(employees.filter((emp) => emp.id !== userId));
  };

  return (
    <Card className="m-4 p-4 bg-background dark:border-none dark:shadow-gray-950">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-600">
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} className="dark:border-gray-600">
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
                            handleRemoveUserFromOrg(employee.id);
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
  );
};

export default PersonList;
