import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const vendorsData = [
  { id: "V001", name: "Auto Parts Ltd", contact: "9876543210", email: "contact@autoparts.com", creditDays: 30, region: "Mumbai", gstin: "27AABCU9603R1ZV" },
  { id: "V002", name: "Spare World Inc", contact: "9876543211", email: "sales@spareworld.com", creditDays: 45, region: "Delhi", gstin: "07AABCU9603R1ZW" },
  { id: "V003", name: "Motor Solutions", contact: "9876543212", email: "info@motorsol.com", creditDays: 30, region: "Bangalore", gstin: "29AABCU9603R1ZX" },
  { id: "V004", name: "Parts Depot", contact: "9876543213", email: "orders@partsdepot.com", creditDays: 60, region: "Chennai", gstin: "33AABCU9603R1ZY" },
  { id: "V005", name: "Quick Parts Supply", contact: "9876543214", email: "support@quickparts.com", creditDays: 15, region: "Pune", gstin: "27AABCU9603R1ZZ" },
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredVendors = vendorsData.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact.includes(searchTerm)
  );

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vendor added successfully!");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Vendors</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your supplier relationships</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Enter vendor details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input id="vendorName" placeholder="Enter name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" type="tel" placeholder="Enter contact" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditDays">Credit Days</Label>
                  <Input id="creditDays" type="number" placeholder="e.g., 30" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input id="region" placeholder="e.g., Mumbai" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" placeholder="Enter GSTIN" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Full address" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Vendor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => toast.success("Exporting vendors list")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Credit Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Region</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GSTIN</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{vendor.id}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{vendor.name}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{vendor.contact}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{vendor.email}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{vendor.creditDays}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{vendor.region}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{vendor.gstin}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editing vendor")}>
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
