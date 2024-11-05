import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

import { PersonProps } from "../../pages/admin"
import { Card, CardContent } from "../ui/card";

interface PersonListProps {
  title: string;
  people: Array<PersonProps>;
}

const PersonList = ({ title, people }: PersonListProps) => {
  return (
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
    </Card>
  );
};

export default PersonList;
