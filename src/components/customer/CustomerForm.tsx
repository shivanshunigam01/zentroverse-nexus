import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetCustomerByIDQuery, useAddCustomerMutation, useUpdateCustomerMutation  } from '@/redux/services/customers';

const schema = z.object({
  customerType: z.enum(['Corporate', 'Individual']),
  tpin: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  mobileNo: z.string().min(10),
  email: z.string().email(),
  birthday: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  address: z.object({
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    region: z.string().min(1),
    regionCode: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().min(1),
  }),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomerForm({ id, onDone, onCancel }: { id?: string | null; onDone?: () => void; onCancel?: () => void }) {
  const { data: existing } = useGetCustomerByIDQuery({ id: id || '' }, { skip: !id });
  const [addCustomer] = useAddCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerType: 'Individual',
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        region: '',
        regionCode: '',
        pincode: '',
        country: '',
      },
      source: 'Walk-in',
    },
  });

  useEffect(() => {
    if (existing?.data) {
      const d = existing.data;
      reset({
        customerType: d.customerType,
        tpin: d.tpin,
        firstName: d.firstName,
        lastName: d.lastName,
        mobileNo: d.mobileNo,
        email: d.email,
        birthday: d.birthday ? d.birthday.split('T')[0] : undefined,
        gender: d.gender,
        address: {
          addressLine1: d.address?.addressLine1,
          addressLine2: d.address?.addressLine2,
          city: d.address?.city,
          region: d.address?.region,
          regionCode: d.address?.regionCode,
          pincode: d.address?.pincode,
          country: d.address?.country,
        },
        source: d.source,
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      customerType: values.customerType,
      tpin: values.tpin,
      firstName: values.firstName,
      lastName: values.lastName,
      mobileNo: values.mobileNo,
      email: values.email,
      birthday: values.birthday,
      gender: values.gender,
      address: {
        addressLine1: values.address.addressLine1,
        addressLine2: values.address.addressLine2,
        city: values.address.city,
        region: values.address.region,
        regionCode: values.address.regionCode,
        pincode: values.address.pincode,
        country: values.address.country,
      },
      source: values.source,
    };
    if (id) {
      updateCustomer({ id, body: payload }).unwrap()
        .then(() => { toast.success('Updated customer'); onDone?.(); })
        .catch(() => toast.error('Update failed'));
    } else {
      addCustomer(payload).unwrap()
        .then(() => { toast.success('Created customer'); onDone?.(); reset(); })
        .catch(() => toast.error('Create failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Customer Type</Label>
          <Controller
            control={control}
            name="customerType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label>TPIN</Label>
          <Input {...register('tpin')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input {...register('firstName')} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input {...register('lastName')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Mobile Number</Label>
          <Input {...register('mobileNo')} />
        </div>
        <div>
          <Label>Email</Label>
          <Input {...register('email')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Birthday</Label>
          <Input {...register('birthday')} type="date" />
        </div>
        <div>
          <Label>Gender</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('address.addressLine1')} placeholder="Address Line 1" />
          <Input {...register('address.addressLine2')} placeholder="Address Line 2" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input {...register('address.city')} placeholder="City" />
          <Input {...register('address.region')} placeholder="Region" />
          <Input {...register('address.regionCode')} placeholder="Region Code" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input {...register('address.pincode')} placeholder="Pincode" />
          <Input {...register('address.country')} placeholder="Country" />
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <Label>Source</Label>
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Walk-in">Walk-in</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{id ? 'Update' : 'Create'} Customer</Button>
      </div>
    </form>
  );
}
