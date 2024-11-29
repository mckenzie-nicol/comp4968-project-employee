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

const handleCreateProject = async (
  projectName: string,
  totalHours: number,
  estStartDate: Date,
  estEndDate: Date
) => {
  if (
    !projectName ||
    !totalHours ||
    !estStartDate ||
    (!estEndDate && sessionStorage.getItem("role") !== "project_manager")
  ) {
    return {
      error: "Missing Requirements Error",
      message:
        "Error, missing project requirements. Must have project name, estimated hours, estimated start date and estimated end date.",
    };
  }
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

  console.log(response);
};

export default function CreateProject() {
  const [projectName, setProjectName] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [estStartDate, setEstStartDate] = useState<Date>();
  const [estEndDate, setEstEndDate] = useState<Date>();
  const [open, setOpen] = useState<boolean>(false);

  const onCreateProject = () => {
    if (!projectName || !totalHours || !estStartDate || !estEndDate) {
      const errorElement = document.getElementById("createProjectError");
      if (errorElement) {
        errorElement.innerHTML =
          "Invalid request, please enter the project name, the estimated total hours, the start date, and the end date for the project.";
      }
    } else {
      handleCreateProject(projectName, totalHours, estStartDate, estEndDate);
      setOpen(false);
    }
  };

  useEffect(() => {
    setProjectName("");
    setTotalHours(0);
    setEstEndDate(undefined);
    setEstStartDate(undefined);
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>Create Project</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creating a project...</DialogTitle>
            <DialogDescription>
              <div>Please enter the project details:</div>
              <div className="flex justify-evenly">
                <div className="flex-col">
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
              <label htmlFor="">Estimated Start Date</label>
              <DatePicker
                selected={estStartDate}
                setSelected={setEstStartDate}
              />
              <label htmlFor="">Estimated End Date</label>
              <DatePicker selected={estEndDate} setSelected={setEstEndDate} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex-col">
              <div className="flex justify-end">
                <Button onClick={onCreateProject}>Create Project</Button>
                <DialogClose>
                  <Button
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
              <div id="createProjectError"></div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
