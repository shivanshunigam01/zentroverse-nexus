import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Download, Trash2, Loader } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetVendorsQuery, useDeleteVendorMutation } from "@/redux/services/vendorSlice";
import VendorForm from "@/components/VendorForm";

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(200);

  const { data: vendorsData, isLoading, error } = useGetVendorsQuery({ page, limit });
  const [deleteVendor] = useDeleteVendorMutation();

  const vendors = vendorsData?.data ?? [];

  const filteredVendors = vendors.filter((vendor: any) =>
    (vendor.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contact || "").includes(searchTerm)
  );

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      deleteVendor({ id: vendorId })
        .unwrap()
        .then(() => toast.success("Vendor deleted successfully"))
        .catch((error) => {
          const message = error?.data?.message || "Failed to delete vendor";
          toast.error(message);
        });
    }
  };

  const handleExportVendors = () => {
    try {
      const csvContent = [
        ['ID', 'Name', 'Contact', 'Email', 'Credit Days', 'Region', 'GSTIN', 'Address'],
        ...vendors.map(vendor => [
          vendor._id || vendor.id || '',
          vendor.name || '',
          vendor.contact || '',
          vendor.email || '',
          vendor.creditDays || '',
          vendor.region || '',
          vendor.gstin || '',
          vendor.address || ''
        ])
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Vendors list exported successfully");
    } catch {
      toast.error("Failed to export vendors list");
    }
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
              <DialogTitle>{editingId ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update vendor details" : "Enter vendor details"}
              </DialogDescription>
            </DialogHeader>
            <VendorForm
              id={editingId}
              onDone={() => {
                setIsDialogOpen(false);
                setEditingId(null);
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingId(null);
              }}
            />
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
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleExportVendors}
              disabled={isLoading || vendors.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">Failed to load vendors</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No vendors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
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
                  {filteredVendors.map((vendor: any) => (
                    <tr key={vendor._id || vendor.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{vendor.name}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{vendor.contact}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{vendor.email}</td>
                      <td className="py-3 px-4 text-sm text-center text-foreground">{vendor.creditDays}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{vendor.region}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{vendor.gstin}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingId(vendor._id || vendor.id);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteVendor(vendor._id || vendor.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
