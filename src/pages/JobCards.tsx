import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Eye, Edit, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const jobCardsData = [
  { jobNo: "JC-2024-001", customer: "Rajesh Kumar", vehicle: "Maruti Swift", regNo: "MH 01 AB 1234", advisor: "Amit Shah", status: "In Progress", date: "2024-01-15" },
  { jobNo: "JC-2024-002", customer: "Priya Sharma", vehicle: "Honda City", regNo: "MH 02 CD 5678", advisor: "Sneha Patel", status: "Completed", date: "2024-01-15" },
  { jobNo: "JC-2024-003", customer: "Amit Patel", vehicle: "Hyundai Creta", regNo: "MH 03 EF 9012", advisor: "Rahul Mehta", status: "Pending", date: "2024-01-14" },
  { jobNo: "JC-2024-004", customer: "Sneha Desai", vehicle: "Toyota Innova", regNo: "MH 04 GH 3456", advisor: "Amit Shah", status: "In Progress", date: "2024-01-14" },
  { jobNo: "JC-2024-005", customer: "Vikram Singh", vehicle: "Mahindra XUV700", regNo: "MH 05 IJ 7890", advisor: "Sneha Patel", status: "Completed", date: "2024-01-13" },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Completed": "default",
    "In Progress": "secondary",
    "Pending": "outline",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

export default function JobCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredJobs = jobCardsData.filter(job => {
    const matchesSearch = job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateJobCard = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Job card created successfully!");
    setIsDialogOpen(false);
  };

  const handleExport = () => {
    toast.success("Exporting job cards data...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all workshop job cards</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Job Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Card</DialogTitle>
              <DialogDescription>Enter the details to create a new job card</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJobCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Vehicle Make</Label>
                  <Input id="make" placeholder="e.g., Maruti" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" placeholder="e.g., Swift" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regNo">Registration No</Label>
                  <Input id="regNo" placeholder="e.g., MH 01 AB 1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN</Label>
                  <Input id="vin" placeholder="Vehicle Identification Number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="odometer">Odometer Reading</Label>
                <Input id="odometer" type="number" placeholder="e.g., 45000" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="Enter name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" type="tel" placeholder="Enter mobile" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concerns">Customer Concerns / Remarks</Label>
                <Textarea id="concerns" placeholder="Describe the issues" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="advisor">Service Advisor</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select advisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amit">Amit Shah</SelectItem>
                      <SelectItem value="sneha">Sneha Patel</SelectItem>
                      <SelectItem value="rahul">Rahul Mehta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advance">Advance Payment</Label>
                  <Input id="advance" type="number" placeholder="₹ 0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Details</Label>
                <Input id="insurance" placeholder="Insurance company & policy" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Job Card</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer, vehicle, or reg no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reg No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service Advisor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.jobNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{job.jobNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.customer}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.vehicle}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.regNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{job.advisor}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(job.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{job.date}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing job details")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editing job card")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Printing job card")}>
                          <Printer className="h-4 w-4" />
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
