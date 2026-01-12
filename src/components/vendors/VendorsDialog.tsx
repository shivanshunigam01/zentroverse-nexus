import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VendorForm from './VendorForm';

interface VendorsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  onVendorSaved?: () => void;
  onAddClick?: () => void;
}

export default function VendorsDialog({
  isOpen,
  onOpenChange,
  editingId,
  onVendorSaved,
  onAddClick,
}: VendorsDialogProps) {
  const [internalEditingId, setInternalEditingId] = useState<string | null>(
    editingId
  );

  useEffect(() => {
    setInternalEditingId(editingId);
  }, [editingId]);

  const handleDone = () => {
    onOpenChange(false);
    setInternalEditingId(null);
    onVendorSaved?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
    setInternalEditingId(null);
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !editingId) {
      // Reset editing ID when opening dialog for new vendor
      setInternalEditingId(null);
      onAddClick?.();
    }
    onOpenChange(open);
  };

  const isEditing = !!internalEditingId;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update vendor details below'
              : 'Enter vendor details to add a new vendor'}
          </DialogDescription>
        </DialogHeader>
        <VendorForm
          id={internalEditingId}
          onDone={handleDone}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
