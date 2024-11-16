import { useEffect, useState } from "react";
import PersonList from "@/components/admin/person-list";

export interface PersonProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const functionToGetAdmin = async () => {
  return { id: 1, organizationId: 1, firstName: "Bob", lastName: "Smith" };
};

const functionToGetOrganizationName = async (organizationId: number) => {
  return { organizationId, organizationName: "Org Name" };
};

const functionToGetProjectManagers = async () : Promise<PersonProps[]> => {
  return [
    {
      id: 2,
      firstName: "Tim",
      lastName: "Jones",
      email: "timjones@exampleOrg.com",
    },
    {
      id: 3,
      firstName: "Rob",
      lastName: "Jones",
      email: "robjones@exampleOrg.com",
    },
    {
      id: 4,
      firstName: "Rick",
      lastName: "Jones",
      email: "rickjones@exampleOrg.com",
    },
    {
      id: 5,
      firstName: "Ted",
      lastName: "Jones",
      email: "tedjones@exampleOrg.com",
    },
  ];
};

const functionToGetEmployees = async () : Promise<PersonProps[]> => {
  return [
    {
      id: 6,
      firstName: "Tim",
      lastName: "Jones",
      email: "timjones@exampleOrg.com",
    },
    {
      id: 7,
      firstName: "Rob",
      lastName: "Jones",
      email: "robjones@exampleOrg.com",
    },
    {
      id: 8,
      firstName: "Rick",
      lastName: "Jones",
      email: "rickjones@exampleOrg.com",
    },
    {
      id: 9,
      firstName: "Ted",
      lastName: "Jones",
      email: "tedjones@exampleOrg.com",
    },
  ];
};

function Admin() {
  const [organizationName, setOrganizationName] = useState("");
  const [projectManagers, setProjectManagers] = useState<PersonProps[]>([]);
  const [employees, setEmployees] = useState<PersonProps[]>([]);

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
    <div>
      <h1 className="text-3xl font-bold">{organizationName}</h1>
      <PersonList title="Project Managers" people={projectManagers} addMemberCallback={() => { /* callback logic here */ }} />
      <PersonList title="Employees" people={employees} addMemberCallback={() => { /* callback logic here */ }} />
    </div>
  );
}

export default Admin;
