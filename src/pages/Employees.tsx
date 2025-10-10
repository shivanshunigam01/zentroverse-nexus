import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Edit } from "lucide-react";
import { toast } from "sonner";

const employeesData = [
  { id: "EMP-001", name: "Ravi Sharma", designation: "Senior Technician", ratePerHr: "₹150", status: "Clocked In", clockTime: "09:00 AM" },
  { id: "EMP-002", name: "Amit Shah", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked In", clockTime: "08:30 AM" },
  { id: "EMP-003", name: "Sneha Patel", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked Out", clockTime: "06:00 PM" },
  { id: "EMP-004", name: "Vikram Desai", designation: "Technician", ratePerHr: "₹120", status: "Clocked In", clockTime: "09:15 AM" },
  { id: "EMP-005", name: "Rahul Mehta", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked In", clockTime: "08:45 AM" },
];

export default function Employees() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage workshop staff</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Adding new employee")}>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Designation</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Rate/Hr</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Clock Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeesData.map((emp) => (
                  <tr key={emp.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{emp.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{emp.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{emp.designation}</td>
                    <td className="py-3 px-4 text-sm text-foreground text-right">{emp.ratePerHr}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{emp.clockTime}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={emp.status === "Clocked In" ? "default" : "outline"}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => toast.success(emp.status === "Clocked In" ? "Clocked out" : "Clocked in")}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editing employee")}>
                          <Edit className="h-4 w-4" />
                        </Button>
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
