import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export default function CreateProject() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Create Project</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Creating a project...
                    </DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}