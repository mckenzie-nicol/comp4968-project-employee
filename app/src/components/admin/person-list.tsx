import { PersonProps } from "@/pages/admin";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Input } from "../ui/input";

interface PersonListProps {
  title: string;
  people: Array<PersonProps>;
  addMemberCallback: () => void;
}

const PersonList = ({ title, people, addMemberCallback }: PersonListProps) => {
  return (
    <>
      <Card className="m-4 p-4">
        <h1 className="text-xl font-bold">{title}</h1>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead className="text-right">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {people.map((person: PersonProps) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.id}</TableCell>
                  <TableCell>{person.firstName}</TableCell>
                  <TableCell>{person.lastName}</TableCell>
                  <TableCell className="text-right">{person.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="w-full flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="flex-col space-y-10">
                  <DialogTitle>
                    Adding a {title.slice(0, -1)} to your organization...
                  </DialogTitle>
                  <DialogDescription>
                    <div className="flex-col space-y-5">
                      <div className="flex-col space-y-3">
                        <label>First Name</label>
                        <Input
                          id="firstName"
                          type="firstName"
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
                          placeholder="Email..."
                          required
                          className="backdrop-blur-sm bg-white/50 border-gray-200"
                        />
                      </div>
                    </div>
                  </DialogDescription>
                </div>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </DialogClose>
                <Button onClick={() => addMemberCallback()}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </>
  );
};

export default PersonList;
