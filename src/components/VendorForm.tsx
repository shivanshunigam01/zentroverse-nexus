import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGetVendorByIDQuery, useAddVendorMutation, useUpdateVendorMutation } from '@/redux/services/vendorSlice';

const schema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  contact: z.string().min(10, 'Contact must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  creditDays: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(1, 'Credit days must be at least 1')),
  region: z.string().min(1, 'Region is required'),
  gstin: z.string().min(15, 'GSTIN must be at least 15 characters'),
  address: z.string().min(5, 'Address is required'),
});

type FormValues = z.infer<typeof schema>;

export default function VendorForm({ 
  id, 
  onDone, 
  onCancel 
}: { 
  id?: string | null; 
  onDone?: () => void; 
  onCancel?: () => void; 
}) {
  const { data: existing } = useGetVendorByIDQuery(
    { id: id || '' }, 
    { skip: !id }
  );
  const [addVendor] = useAddVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      creditDays: 30,
      region: '',
      gstin: '',
      address: '',
    },
  });

  useEffect(() => {
    if (existing?.data) {
      const d = existing.data;
      reset({
        name: d.name || '',
        contact: d.contact || '',
        email: d.email || '',
        creditDays: d.creditDays || 30,
        region: d.region || '',
        gstin: d.gstin || '',
        address: d.address || '',
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      contact: values.contact,
      email: values.email,
      creditDays: values.creditDays,
      region: values.region,
      gstin: values.gstin,
      address: values.address,
    };

    if (id) {
      updateVendor({ id, body: payload })
        .unwrap()
        .then(() => {
          toast.success('Vendor updated successfully');
          onDone?.();
        })
        .catch((error) => {
          const message = error?.data?.message || 'Failed to update vendor';
          toast.error(message);
        });
    } else {
      addVendor(payload)
        .unwrap()
        .then(() => {
          toast.success('Vendor created successfully');
          onDone?.();
          reset();
        })
        .catch((error) => {
          const message = error?.data?.message || 'Failed to create vendor';
          toast.error(message);
        });
    }
  };

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
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contact">Contact Number *</Label>
        <Input
          id="contact"
          type="tel"
          placeholder="Enter contact number"
          {...register('contact')}
          className={errors.contact ? 'border-red-500' : ''}
        />
        {errors.contact && (
          <p className="text-sm text-red-500">{errors.contact.message}</p>
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
        />
        {errors.gstin && (
          <p className="text-sm text-red-500">{errors.gstin.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          placeholder="Enter full address"
          {...register('address')}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {id ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </form>
  );
}
