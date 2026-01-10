import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetStockByIDQuery, useAddStockMutation, useUpdateStockMutation } from '@/redux/services/stock';
import { toast } from 'sonner';

const toNumber = (val: unknown) => (val === '' || val === null || val === undefined) ? undefined : Number(val);

const schema = z.object({
  partNumber: z.string().min(1),
  partName: z.string().min(1),
  brand: z.string().optional(),
  category: z.string().optional(),
  quantityOnHand: z.preprocess(toNumber, z.number().min(0)),
  purchasePrice: z.preprocess(toNumber, z.number().min(0)),
  sellingPrice: z.preprocess(toNumber, z.number().min(0)),
  taxType: z.string().optional(),
  taxPercent: z.preprocess(toNumber, z.number().min(0)).optional(),
  racNo: z.string().optional(),
  minStockLevel: z.preprocess(toNumber, z.number().min(0)).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function StockForm({ id, onDone, onCancel }: { id?: string | null; onDone?: () => void; onCancel?: () => void }) {
  const { data: stock, isLoading } = useGetStockByIDQuery({ id: id || '' }, { skip: !id });
  const [addStock] = useAddStockMutation();
  const [updateStock] = useUpdateStockMutation();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });
  console.log(id,stock);
  useEffect(() => {
    if (stock?.data) {
      const s = stock.data;
      setValue('partNumber', s.partNumber ?? s.partNo ?? '');
      setValue('partName', s.partName ?? s.name ?? '');
      setValue('brand', s.brand ?? '');
      setValue('category', s.category ?? '');
      setValue('quantityOnHand', Number(s.quantityOnHand ?? s.qoh ?? 0));
      setValue('purchasePrice', Number(s.purchasePrice ?? 0));
      setValue('sellingPrice', Number(s.sellingPrice ?? 0));
      setValue('taxPercent', Number(s.taxPercent ?? s.tax ?? 0));
      setValue('racNo', s.racNo ?? '');
      setValue('minStockLevel', Number(s.minStockLevel ?? 0));
    }
  }, [stock, setValue]);

  const onSubmit = (values: FormValues) => {
    const body = {
      partNumber: values.partNumber,
      partName: values.partName,
      brand: values.brand,
      category: values.category,
      quantityOnHand: Number(values.quantityOnHand || 0),
      purchasePrice: Number(values.purchasePrice || 0),
      sellingPrice: Number(values.sellingPrice || 0),
      taxType: values.taxType,
      taxPercent: Number(values.taxPercent ?? 0),
      racNo: values.racNo,
      minStockLevel: Number(values.minStockLevel ?? 0),
    };

    if (id) {
      updateStock({ id, body }).unwrap()
        .then(() => { toast.success('Updated'); onDone?.(); reset(); })
        .catch(() => toast.error('Update failed'));
    } else {
      addStock(body).unwrap()
        .then(() => { toast.success('Added'); onDone?.(); reset(); })
        .catch(() => toast.error('Add failed'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Part Number</Label>
          <Controller control={control} name="partNumber" render={({ field }) => <Input {...field} placeholder="e.g., OIL-001" />} />
        </div>
        <div className="space-y-2">
          <Label>Part Name</Label>
          <Controller control={control} name="partName" render={({ field }) => <Input {...field} placeholder="e.g., Brake Pad" />} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Brand</Label>
          <Controller control={control} name="brand" render={({ field }) => <Input {...field} />} />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller control={control} name="category" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lubricants">Lubricants</SelectItem>
                <SelectItem value="Filters">Filters</SelectItem>
                <SelectItem value="Brakes">Brakes</SelectItem>
                <SelectItem value="Ignition">Ignition</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Quantity on Hand</Label>
          <Controller control={control} name="quantityOnHand" render={({ field }) => <Input type="number" {...field} />} />
        </div>
        <div className="space-y-2">
          <Label>Purchase Price</Label>
          <Controller control={control} name="purchasePrice" render={({ field }) => <Input type="number" {...field} />} />
        </div>
        <div className="space-y-2">
          <Label>Selling Price</Label>
          <Controller control={control} name="sellingPrice" render={({ field }) => <Input type="number" {...field} />} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tax %</Label>
          <Controller control={control} name="taxPercent" render={({ field }) => <Input type="number" {...field} />} />
        </div>
        <div className="space-y-2">
          <Label>RAC No</Label>
          <Controller control={control} name="racNo" render={({ field }) => <Input {...field} />} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Min Stock Level</Label>
        <Controller control={control} name="minStockLevel" render={({ field }) => <Input type="number" {...field} />} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => { reset(); onCancel?.(); }}>Cancel</Button>
        <Button type="submit">{id ? 'Save' : 'Add Part'}</Button>
      </div>
    </form>
  );
}
