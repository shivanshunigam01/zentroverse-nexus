import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Download } from "lucide-react";
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

const individualCustomers = [
  { id: "C001", name: "Rajesh Kumar", mobile: "9876543210", email: "rajesh@email.com", address: "Mumbai", createdBy: "Admin" },
  { id: "C002", name: "Priya Sharma", mobile: "9876543211", email: "priya@email.com", address: "Delhi", createdBy: "Admin" },
  { id: "C003", name: "Amit Patel", mobile: "9876543212", email: "amit@email.com", address: "Bangalore", createdBy: "Amit Shah" },
];

const corporateCustomers = [
  { id: "CC001", company: "TechCorp Pvt Ltd", contact: "9876543220", email: "info@techcorp.com", gstin: "27AABCU9603R1ZV", address: "Mumbai" },
  { id: "CC002", company: "Auto Fleet Services", contact: "9876543221", email: "fleet@autoservices.com", gstin: "07AABCU9603R1ZW", address: "Delhi" },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Customer added successfully!");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer database</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter customer details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input id="name" placeholder="Enter name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input id="mobile" type="tel" placeholder="Enter mobile" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Full address" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Customer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="corporate">Corporate</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon" onClick={() => toast.success("Exporting customers")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mobile</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Address</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created By</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{customer.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{customer.name}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{customer.mobile}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{customer.email}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{customer.address}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{customer.createdBy}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="icon" onClick={() => toast.info("Editing customer")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search corporate customers..." className="pl-10" />
                </div>
                <Button variant="outline" size="icon" onClick={() => toast.success("Exporting customers")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Company Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GSTIN</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Address</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {corporateCustomers.map((company) => (
                      <tr key={company.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{company.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{company.company}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{company.contact}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{company.email}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{company.gstin}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{company.address}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="icon" onClick={() => toast.info("Editing company")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
