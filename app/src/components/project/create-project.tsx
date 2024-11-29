import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { DatePicker } from "../ui/date-picker";
import refreshTokens from "@/actions/refresh-token";
import { PersonProps } from "@/pages/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const handleCreateProject = async (
  projectName: string,
  totalHours: number,
  estStartDate: Date,
  estEndDate: Date
) => {
  const body = {
    projectName: projectName,
    projectManagerId: sessionStorage.getItem("userId"),
    totalHours: totalHours,
    estStartDate: estStartDate,
    estEndDate: estEndDate,
  };
  const tokenExpiry = parseInt(sessionStorage.getItem("tokenExpiry") || "0");
  if (Date.now() > tokenExpiry) {
    await refreshTokens();
  }
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const response = await fetch(
    "https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Authorization": accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

const getAllWorkers = async () => {
  const organizationId = sessionStorage.getItem("organizationId");
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const response = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/organizations/${organizationId}/users`,
    {
      method: "GET",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    }
  );
  const workers: PersonProps[] = [];
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  jsonResponse.results.forEach((worker: PersonProps) => {
    if (worker.role === "worker") {
      workers.push(worker);
    }
  });
  console.log(workers);
  return workers;
};

const handleAddWorkers = async (projectId: string, workerIds: { worker_id: string }[]) => {
  const accessToken = sessionStorage.getItem("accessToken") || "";
  const body = {
    workerIds: workerIds
  }  
  const result = await fetch(
    `https://ifyxhjgdgl.execute-api.us-west-2.amazonaws.com/test/project/manager/${projectId}/workers`,
    {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  console.log(result);
};

export default function CreateProject() {
  const [projectName, setProjectName] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [estStartDate, setEstStartDate] = useState<Date>();
  const [estEndDate, setEstEndDate] = useState<Date>();
  const [open, setOpen] = useState<boolean>(false);
  const [workers, setWorkers] = useState<PersonProps[]>();
  const [selectedWorkers, setSelectedWorkers] = useState<PersonProps[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");

  const onCreateProject = async () => {
    const errorElement = document.getElementById("createProjectError");
    try {
      if (!projectName || !totalHours || !estStartDate || !estEndDate) {
      if (errorElement) {
        errorElement.innerHTML =
          "<strong>Error!</strong><br/>Invalid request, please enter the project name, the estimated total hours, the start date, and the end date for the project.";
      }
    } else {
      const projectResponse = await handleCreateProject(
        projectName,
        totalHours,
        estStartDate,
        estEndDate
      );
      if (projectResponse && workers) {
        const project = await projectResponse.json();
        const workerIds = selectedWorkers.map((worker) => ({ worker_id: worker.id }));
        handleAddWorkers(project.data.id, workerIds);
      }
      setOpen(false);
    }
  } catch (error) {
    if (errorElement) {
      errorElement.innerHTML = `An error occured: ${error} -- please try again.`;
    }
  }
  };

  const onAddWorker = () => {
    if (selectedWorkerId) {
      const worker = workers?.find((w) => w.id === selectedWorkerId);
      if (worker) {
        setSelectedWorkers((prevList) => {
          if (!prevList.some((w) => w.id === worker.id)) {
            return [...prevList, worker];
          } else {
            return prevList;
          }
        });
        setSelectedWorkerId("");
      }
    }
  };

  const onRemoveWorker = (workerId: string) => {
    setSelectedWorkers((prevList) =>
      prevList.filter((worker) => worker.id !== workerId)
    );
  };

  useEffect(() => {
    const initializeWorkers = async () => {
      const result = await getAllWorkers();
      setWorkers(result);
    };
    initializeWorkers();
  }, []);

  useEffect(() => {
    setProjectName("");
    setTotalHours(0);
    setEstEndDate(undefined);
    setEstStartDate(undefined);
    setSelectedWorkers([]);
    setSelectedWorkerId("");
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Create Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Creating a project...</DialogTitle>
            <DialogDescription className="mx-4">
              <div className="mb-2">Please enter the project details:</div>
              <div className="flex justify-between mb-4">
                <div className="flex-col w-[50%]">
                  <label>Project Name</label>
                  <Input
                    id="projectName"
                    type="projectName"
                    value={projectName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProjectName(e.target.value)
                    }
                    placeholder="Project name..."
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200"
                  />
                </div>
                <div className="flex-col">
                  <label>Estimated Total Hours</label>
                  <Input
                    id="totalHours"
                    type="number"
                    value={totalHours}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTotalHours(parseFloat(e.target.value))
                    }
                    placeholder="0"
                    required
                    className="backdrop-blur-sm bg-white/50 border-gray-200"
                  />
                </div>
              </div>
              <div className="flex mb-2 justify-between">
                <label className="content-center" htmlFor="">
                  Estimated Start Date:
                </label>
                <DatePicker
                  selected={estStartDate}
                  setSelected={setEstStartDate}
                />
              </div>
              <div className="flex mb-4 justify-between">
                <label className="content-center" htmlFor="">
                  Estimated End Date:
                </label>
                <DatePicker selected={estEndDate} setSelected={setEstEndDate} />
              </div>
              <div>
                <label>Add workers - OPTIONAL</label>
                <div className="w-full flex items-center justify-between">
                  <Select
                    onValueChange={(value) => setSelectedWorkerId(value)}
                    value={selectedWorkerId}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a worker" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {workers &&
                        workers.map((worker) => (
                          <SelectItem key={worker.id} value={worker.id}>
                            {`${worker.first_name} ${worker.last_name} - ${worker.email}`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button className="mx-8" onClick={onAddWorker}>
                    Add
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap mt-2">
                {selectedWorkers.map((worker) => (
                  <div
                    className="w-full border-2 rounded-md p-2 m-1 flex items-center justify-between"
                    key={worker.id}
                  >
                    <span className="mr-2">
                      {`${worker.first_name} ${worker.last_name} - ${worker.email}`}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveWorker(worker.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <div className="flex-col">
              <div className="flex space-x-4 justify-end">
                <Button onClick={onCreateProject}>Create Project</Button>
                <DialogClose>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      setProjectName("");
                      setTotalHours(0);
                      setEstStartDate(undefined);
                      setEstEndDate(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            <div className="mt-4 mx-6 text-red-600 font-bold" id="createProjectError"></div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
