import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Loader, X } from "lucide-react";
import { toast } from "sonner";
import {
  useGetVendorsQuery,
  useExportVendorsExcelMutation,
} from "@/redux/services/vendorSlice";
import VendorsDialog from "@/components/vendors/VendorsDialog";
import VendorsTable from "@/components/vendors/VendorsTable";
import { Vendor } from "@/types/vendor";
import { useThrottledSearch } from "@/hooks/useThrottledSearch";

export default function Vendors() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(200);
  const [isExporting, setIsExporting] = useState(false);
  const [apiSearchTerm, setApiSearchTerm] = useState("");

  // Use throttled search hook with 500ms delay
  const { searchTerm, handleSearch, clearSearch } = useThrottledSearch(
    (value) => setApiSearchTerm(value),
    500
  );

  // API call with search parameter
  const {
    data: vendorsData,
    isLoading,
    error,
    refetch,
  } = useGetVendorsQuery({
    page,
    limit,
    search: apiSearchTerm,
  });

  const [exportVendorsExcel, { isLoading: isExcelLoading }] =
    useExportVendorsExcelMutation();

  const vendors: Vendor[] = vendorsData?.vendors ?? [];

  const handleExportExcel = async () => {
    try {
      const blob = await exportVendorsExcel({
        search: apiSearchTerm,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendors-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Vendors exported to Excel successfully");
    } catch (error) {
      toast.error("Failed to export vendors to Excel");
    }
  };

  const handleExportVendors = () => {
    try {
      const csvContent = [
        ["ID", "Name", "Contact", "Email", "Credit Days", "Region", "GSTIN"],
        ...vendors.map((vendor) => [
          vendor._id,
          vendor.name,
          vendor.contactNumber,
          vendor.email,
          vendor.creditDays.toString(),
          vendor.region,
          vendor.gstin,
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Vendors list exported to CSV successfully");
    } catch {
      toast.error("Failed to export vendors list");
    }
  };

  const handleEditVendor = (vendorId: string) => {
    setEditingId(vendorId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingId(null);
    }
  };

  const handleVendorSaved = () => {
    refetch();
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Vendors
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your supplier relationships
          </p>
        </div>
        <VendorsDialog
          isOpen={isDialogOpen}
          onOpenChange={handleCloseDialog}
          editingId={editingId}
          onVendorSaved={handleVendorSaved}
        />
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors by name, email, or contact..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExportExcel}
                disabled={
                  isLoading ||
                  isExporting ||
                  isExcelLoading ||
                  vendors.length === 0
                }
                title="Export vendors to Excel"
              >
                {isExporting || isExcelLoading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-sm text-destructive">Failed to load vendors</p>
            </div>
          ) : (
            <>
              <VendorsTable
                vendors={vendors}
                isLoading={isLoading}
                onEdit={handleEditVendor}
              />
              {!isLoading && vendors.length === 0 && apiSearchTerm && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No vendors found matching "{apiSearchTerm}"
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
