import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddPurchaseOrderMutation, useGetPurchaseOrderByIDQuery, useUpdatePurchaseOrderMutation } from '@/redux/services/purchaseSlice';
import { toast } from 'sonner';

const partSchema = z.object({
  partNumber: z.string().min(1),
  partName: z.string().min(1),
  quantity: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(1)),
  unitPrice: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0)),
  taxPercent: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0)),
});

const schema = z.object({
  orderDate: z.string().optional(),
  regNo: z.string().optional(),
  jobCardNo: z.string().optional(),
  vendorName: z.string().min(1),
  vendorContact: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    gstNo: z.string().optional(),
  }).optional(),
  orderedParts: z.array(partSchema).min(1),
});

type FormValues = z.infer<typeof schema>;

export default function PurchaseOrderForm({ id, onDone, onCancel }: { id?: string | null; onDone?: () => void; onCancel?: () => void }) {
  const { data: existing } = useGetPurchaseOrderByIDQuery({ id: id || '' }, { skip: !id });
  const [addPurchaseOrder] = useAddPurchaseOrderMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const { control, handleSubmit, reset, register } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { orderedParts: [{ partNumber: '', partName: '', quantity: 1, unitPrice: 0, taxPercent: 0 }] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'orderedParts' });

  useEffect(() => {
    if (existing?.data) {
      const d = existing.data;
      reset({
        orderDate: d.orderDate ? d.orderDate.split('T')[0] : undefined,
        regNo: d.regNo,
        jobCardNo: d.jobCardNo,
        vendorName: d.vendorName,
        vendorContact: d.vendorContact,
        orderedParts: (d.orderedParts || []).map((p: any) => ({ partNumber: p.partNumber, partName: p.partName, quantity: p.quantity, unitPrice: p.unitPrice, taxPercent: p.taxPercent }))
      });
    }
  }, [existing, reset]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      orderDate: values.orderDate,
      regNo: values.regNo,
      jobCardNo: values.jobCardNo,
      vendorName: values.vendorName,
      vendorContact: values.vendorContact,
      orderedParts: values.orderedParts.map(p => ({ partNumber: p.partNumber, partName: p.partName, quantity: p.quantity, unitPrice: p.unitPrice, taxPercent: p.taxPercent })),
    };
    if (id) {
      updatePurchaseOrder({ id, body: payload }).unwrap()
        .then(() => { toast.success('Updated PO'); onDone?.(); })
        .catch(() => toast.error('Update failed'));
    } else {
      addPurchaseOrder(payload).unwrap()
        .then(() => { toast.success('Created PO'); onDone?.(); reset(); })
        .catch(() => toast.error('Create failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Order Date</Label>
          <Input {...register('orderDate')} type="date" />
        </div>
        <div>
          <Label>Reg No</Label>
          <Input {...register('regNo')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Job Card No</Label>
          <Input {...register('jobCardNo')} />
        </div>
        <div>
          <Label>Vendor Name</Label>
          <Input {...register('vendorName')} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Vendor Contact - Phone</Label>
        <Input {...register('vendorContact.phone')} />
      </div>
      <div className="space-y-2">
        <Label>Vendor Contact - Email</Label>
        <Input {...register('vendorContact.email')} />
      </div>

      <div className="space-y-2">
        <Label>Ordered Parts</Label>
        {fields.map((f, idx) => (
          <div key={f.id} className="grid grid-cols-5 gap-2 items-end">
            <Controller control={control} name={`orderedParts.${idx}.partNumber` as any} render={({ field }) => <Input {...field} placeholder="Part No" />} />
            <Controller control={control} name={`orderedParts.${idx}.partName` as any} render={({ field }) => <Input {...field} placeholder="Part Name" />} />
            <Controller control={control} name={`orderedParts.${idx}.quantity` as any} render={({ field }) => <Input type="number" {...field} placeholder="Qty" />} />
            <Controller control={control} name={`orderedParts.${idx}.unitPrice` as any} render={({ field }) => <Input type="number" {...field} placeholder="Unit" />} />
            <Controller control={control} name={`orderedParts.${idx}.taxPercent` as any} render={({ field }) => <Input type="number" {...field} placeholder="Tax %" />} />
            <div className="col-span-5 text-right">
              <Button type="button" variant="destructive" onClick={() => remove(idx)}>Remove</Button>
            </div>
          </div>
        ))}
        <div>
          <Button type="button" onClick={() => append({ partNumber: '', partName: '', quantity: 1, unitPrice: 0, taxPercent: 0 })}>Add Part</Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => { reset(); onCancel?.(); }}>Cancel</Button>
        <Button type="submit">{id ? 'Save' : 'Create PO'}</Button>
      </div>
    </form>
  );
}
