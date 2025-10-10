import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Edit, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const employeesData = [
  { id: "EMP-001", name: "Ravi Sharma", designation: "Senior Technician", ratePerHr: "₹150", status: "Clocked In", clockTime: "09:00 AM" },
  { id: "EMP-002", name: "Amit Shah", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked In", clockTime: "08:30 AM" },
  { id: "EMP-003", name: "Sneha Patel", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked Out", clockTime: "06:00 PM" },
  { id: "EMP-004", name: "Vikram Desai", designation: "Technician", ratePerHr: "₹120", status: "Clocked In", clockTime: "09:15 AM" },
  { id: "EMP-005", name: "Rahul Mehta", designation: "Service Advisor", ratePerHr: "₹200", status: "Clocked In", clockTime: "08:45 AM" },
];

export default function Employees() {
  const [employees, setEmployees] = useState(employeesData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const toggleClock = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === "Clocked In" ? "Clocked Out" : "Clocked In" }
        : emp
    ));
    const emp = employees.find(e => e.id === id);
    toast.success(emp?.status === "Clocked In" ? `${emp.name} clocked out` : `${emp?.name} clocked in`);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newEmployee = {
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: formData.get('name') as string,
      designation: formData.get('designation') as string,
      ratePerHr: `₹${formData.get('rate')}`,
      status: "Clocked Out",
      clockTime: "-"
    };
    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    toast.success("Employee added successfully!");
  };

  const handleCreditSalary = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Salary credited to ${selectedEmployee?.name}`);
    setIsPayrollDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast.success("Employee removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage workshop staff</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter employee details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input name="name" id="name" placeholder="e.g., John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Select name="designation" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senior Technician">Senior Technician</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Service Advisor">Service Advisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate Per Hour (₹)</Label>
                <Input name="rate" id="rate" type="number" placeholder="150" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Employee</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                          onClick={() => toggleClock(emp.id)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setSelectedEmployee(emp); setIsPayrollDialogOpen(true); }}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editing employee")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <Dialog open={isPayrollDialogOpen} onOpenChange={setIsPayrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credit Salary</DialogTitle>
            <DialogDescription>Process salary payment for {selectedEmployee?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreditSalary} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Salary Amount (₹)</Label>
              <Input name="amount" id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input name="paymentDate" id="paymentDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select name="paymentMode" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPayrollDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Process Payment</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
