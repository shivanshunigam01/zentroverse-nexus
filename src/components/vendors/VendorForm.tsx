import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetVendorByIDQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
} from '@/redux/services/vendorSlice';
import { CreateVendorRequest, ApiErrorResponse } from '@/types/vendor';

const schema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  contactNumber: z.string().min(10, 'Contact must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  creditDays: z.preprocess(
    (v) => (v === '' ? undefined : Number(v)),
    z.number().min(1, 'Credit days must be at least 1')
  ),
  region: z.string().min(1, 'Region is required'),
  gstin: z.string().min(15, 'GSTIN must be at least 15 characters'),
});

type FormValues = z.infer<typeof schema>;

interface VendorFormProps {
  id?: string | null;
  onDone?: () => void;
  onCancel?: () => void;
}

export default function VendorForm({
  id,
  onDone,
  onCancel,
}: VendorFormProps) {
  const { data: vendorData, isLoading: isFetching } = useGetVendorByIDQuery(
    { id: id || '' },
    { skip: !id }
  );

  const [addVendor, { isLoading: isAdding }] = useAddVendorMutation();
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      contactNumber: '',
      email: '',
      creditDays: 30,
      region: '',
      gstin: '',
    },
  });

  useEffect(() => {
    if (vendorData?.vendor) {
      const vendor = vendorData.vendor;
      reset({
        name: vendor.name,
        contactNumber: vendor.contactNumber,
        email: vendor.email,
        creditDays: vendor.creditDays,
        region: vendor.region,
        gstin: vendor.gstin,
      });
    }
  }, [vendorData, reset]);

  const onSubmit = (values: FormValues) => {
    const payload: CreateVendorRequest = {
      name: values.name,
      contactNumber: values.contactNumber,
      email: values.email,
      creditDays: values.creditDays,
      region: values.region,
      gstin: values.gstin,
    };

    if (id) {
      // Update vendor
      updateVendor({ id, body: payload })
        .unwrap()
        .then(() => {
          toast.success('Vendor updated successfully');
          onDone?.();
        })
        .catch((error: ApiErrorResponse) => {
          const message = error?.data?.message || 'Failed to update vendor';
          toast.error(message);
        });
    } else {
      // Add new vendor
      addVendor(payload)
        .unwrap()
        .then(() => {
          toast.success('Vendor created successfully');
          onDone?.();
          reset();
        })
        .catch((error: ApiErrorResponse) => {
          const message = error?.data?.message || 'Failed to create vendor';
          toast.error(message);
        });
    }
  };

  const isSubmitting = isAdding || isUpdating;

  // Show loading state while fetching existing vendor data
  if (id && isFetching) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Vendor Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Vendor Name *</Label>
        <Input
          id="name"
          placeholder="Enter vendor name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number *</Label>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="Enter contact number (10+ digits)"
          {...register('contactNumber')}
          className={errors.contactNumber ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.contactNumber && (
          <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Credit Days and Region */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="creditDays">Credit Days *</Label>
          <Input
            id="creditDays"
            type="number"
            placeholder="e.g., 30"
            {...register('creditDays')}
            className={errors.creditDays ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.creditDays && (
            <p className="text-sm text-red-500">{errors.creditDays.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <Input
            id="region"
            placeholder="e.g., Mumbai"
            {...register('region')}
            className={errors.region ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.region && (
            <p className="text-sm text-red-500">{errors.region.message}</p>
          )}
        </div>
      </div>

      {/* GSTIN */}
      <div className="space-y-2">
        <Label htmlFor="gstin">GSTIN *</Label>
        <Input
          id="gstin"
          placeholder="Enter GSTIN (15 characters)"
          {...register('gstin')}
          className={errors.gstin ? 'border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.gstin && (
          <p className="text-sm text-red-500">{errors.gstin.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
          {id ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </form>
  );
}
