import { Button } from '@/components/ui/button';
import { Edit, Trash2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteVendorMutation } from '@/redux/services/vendorSlice';
import { Vendor, ApiErrorResponse } from '@/types/vendor';

interface VendorsTableProps {
  vendors: Vendor[];
  isLoading: boolean;
  onEdit: (vendorId: string) => void;
}

export default function VendorsTable({
  vendors,
  isLoading,
  onEdit,
}: VendorsTableProps) {
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorMutation();

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      deleteVendor({ id: vendorId })
        .unwrap()
        .then(() => toast.success('Vendor deleted successfully'))
        .catch((error: ApiErrorResponse) => {
          const message = error?.data?.message || 'Failed to delete vendor';
          toast.error(message);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No vendors found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Contact
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Email
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Credit Days
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Region
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              GSTIN
            </th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr
              key={vendor._id}
              className="border-b border-border hover:bg-secondary/50 transition-colors"
            >
              <td className="py-3 px-4 text-sm text-foreground font-medium">
                {vendor.name}
              </td>
              <td className="py-3 px-4 text-sm text-foreground">
                {vendor.contactNumber}
              </td>
              <td className="py-3 px-4 text-sm text-foreground">
                {vendor.email}
              </td>
              <td className="py-3 px-4 text-sm text-center text-foreground">
                {vendor.creditDays}
              </td>
              <td className="py-3 px-4 text-sm text-foreground">
                {vendor.region}
              </td>
              <td className="py-3 px-4 text-sm text-foreground">
                {vendor.gstin}
              </td>
              <td className="py-3 px-4 text-sm">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onEdit(vendor._id);
                    }}
                    title="Edit vendor"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteVendor(vendor._id)
                    }
                    disabled={isDeleting}
                    title="Delete vendor"
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
  );
}
