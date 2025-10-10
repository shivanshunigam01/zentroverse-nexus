import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const jobQueueData = [
  { jobNo: "JC-2024-001", vehicle: "MH 01 AB 1234", service: "Full Service", technician: "Ravi Sharma", startTime: "09:30 AM", endTime: "-", status: "In Progress" },
  { jobNo: "JC-2024-003", vehicle: "MH 03 EF 9012", service: "Brake Service", technician: "Vikram Desai", startTime: "10:15 AM", endTime: "-", status: "In Progress" },
  { jobNo: "JC-2024-002", vehicle: "MH 02 CD 5678", service: "Oil Change", technician: "Ravi Sharma", startTime: "08:45 AM", endTime: "10:00 AM", status: "Completed" },
  { jobNo: "JC-2024-004", vehicle: "MH 04 GH 3456", service: "General Checkup", technician: "Vikram Desai", startTime: "-", endTime: "-", status: "Queued" },
];

export default function JobQueue() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Queue</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time job tracking and status</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Queued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">1</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">2</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">1</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Technician</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobQueueData.map((job) => (
                  <tr key={job.jobNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{job.jobNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.vehicle}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.service}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.technician}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{job.startTime}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{job.endTime}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge 
                        variant={
                          job.status === "Completed" ? "default" : 
                          job.status === "In Progress" ? "secondary" : 
                          "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        {job.status === "Queued" && (
                          <Button variant="ghost" size="icon" onClick={() => toast.success("Job started")}>
                            <Play className="h-4 w-4 text-success" />
                          </Button>
                        )}
                        {job.status === "In Progress" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Job paused")}>
                              <Pause className="h-4 w-4 text-warning" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toast.success("Job completed")}>
                              <CheckCircle className="h-4 w-4 text-success" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
