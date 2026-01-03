import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Edit, Trash2 } from "lucide-react";

import { toast } from "sonner";
import {
  useAddStockIssueMutation,
  useDeleteStockIssueMutation,
  useGetStockIssuesQuery,
  useGetStockIssueByIDQuery,
  useUpdateStockIssueMutation,
} from "@/redux/services/stockIssuesSlice";
import { useState, useEffect } from "react";

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export default function StockIssue() {
  const { data } = useGetStockIssuesQuery({
    page: 1,
    limit: 1000,
  });
  const [addStockIssue] = useAddStockIssueMutation();
  const [updateStockIssue] = useUpdateStockIssueMutation();
  const [deleteStockIssue] = useDeleteStockIssueMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: editingData } = useGetStockIssueByIDQuery(
    editingId ? { id: editingId } : ({} as any),
    { skip: !editingId }
  );

  // zod schema
  const itemSchema = z.object({
    partNo: z.string().min(1, 'Part No is required'),
    partName: z.string().min(1, 'Part name is required'),
    brand: z.string().optional(),
    requestedQty: z.preprocess((v) => Number(v), z.number().min(1)),
  });

  const schema = z.object({
    jobCardNo: z.string().min(1),
    regNo: z.string().min(1),
    vehicle: z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      year: z.preprocess((v) => (v === '' || v == null ? undefined : Number(v)), z.number().int().optional()),
      color: z.string().optional(),
    }).optional(),
    issuedTo: z.string().min(1),
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    notes: z.string().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobCardNo: '',
      regNo: '',
      vehicle: { make: '', model: '', year: undefined, color: '' },
      issuedTo: '',
      items: [{ partNo: '', partName: '', brand: '', requestedQty: 1 }],
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // populate form when editingData arrives
  useEffect(() => {
    if (editingData && editingData.data) {
      // normalize to form shape
      const d = editingData.data;
      reset({
        jobCardNo: d.jobCardNo ?? '',
        regNo: d.regNo ?? '',
        vehicle: d.vehicle ?? { make: '', model: '', year: undefined, color: '' },
        issuedTo: d.issuedTo ?? '',
        items: (d.items || []).map((it: any) => ({
          partNo: it.partNo ?? it.partNo,
          partName: it.partName ?? it.partName,
          brand: it.brand ?? '',
          requestedQty: it.requestedQty ?? it.requestedQty ?? 1,
        })),
        notes: d.notes ?? '',
      });
    }
  }, [editingData, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingId) {
        await updateStockIssue({ id: editingId, body: values }).unwrap();
        toast.success('Stock issue updated');
      } else {
        await addStockIssue(values).unwrap();
        toast.success('Stock issue created');
      }
      reset({});
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stock issue?')) return;
    try {
      await deleteStockIssue({ id }).unwrap();
      toast.success('Deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Stock Issue
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Issue parts to job cards or technicians
          </p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">New Stock Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Job Card No</Label>
                <Input {...register('jobCardNo')} />
                {errors.jobCardNo && <p className="text-destructive text-sm">{errors.jobCardNo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Reg No</Label>
                <Input {...register('regNo')} />
                {errors.regNo && <p className="text-destructive text-sm">{errors.regNo.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Make</Label>
                <Input {...register('vehicle.make')} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input {...register('vehicle.model')} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" {...register('vehicle.year' as any)} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input {...register('vehicle.color')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Issued To</Label>
              <Input {...register('issuedTo')} />
              {errors.issuedTo && <p className="text-destructive text-sm">{errors.issuedTo.message}</p>}
            </div>

            <div>
              <Label>Items</Label>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={field.id} className="grid grid-cols-6 gap-2 items-end">
                    <div className="col-span-2">
                      <Input placeholder="Part No" {...register(`items.${idx}.partNo` as const)} />
                    </div>
                    <div className="col-span-2">
                      <Input placeholder="Part Name" {...register(`items.${idx}.partName` as const)} />
                    </div>
                    <div>
                      <Input placeholder="Brand" {...register(`items.${idx}.brand` as const)} />
                    </div>
                    <div>
                      <Input type="number" placeholder="Qty" {...register(`items.${idx}.requestedQty` as const)} />
                    </div>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => remove(idx)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {errors.items && <p className="text-destructive text-sm">{(errors.items as any)?.message}</p>}
                <div>
                  <Button type="button" onClick={() => append({ partNo: '', partName: '', brand: '', requestedQty: 1 })} className="mt-2 gap-2">
                    <Plus className="h-4 w-4" /> Add item
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register('notes')} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                <Save className="h-4 w-4" />
                {editingId ? 'Update Issue' : 'Issue Stock'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Inwards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    issue No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    issued To
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    jobCardNo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    notes{" "}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    regNo{" "}
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Items
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Stock Deducted
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Issued Qty
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Margin Value
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Pending Qty
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Purchase Value
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Requested Qty
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Return Qty
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Total Selling Value
                  </th>
                  <th
                    className="text-center py-3 px-4 text-sm font-medium text-nowrap
 text-muted-foreground"
                  >
                    Issue Date
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    status
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((inward: any) => (
                  <tr
                    key={inward?._id ?? inward?.inwardNo}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-foreground font-medium">
                      {inward?.issueNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.issuedTo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.jobCardNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.notes}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.regNo}
                    </td>

                    <td className="py-3 px-4 text-sm text-center text-foreground">
                      {(inward?.items || []).length}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">
                      {inward?.stockDeducted ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalIssuedQty}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalMarginValue}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalIssuedQty}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalPendingQty}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalPurchaseValue}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalRequestedQty}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalReturnQty}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.totalSellingValue}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground text-nowrap">
                      {inward?.issueDate}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                      <span className="text-foreground">{inward?.status}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingId(inward._id);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inward._id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
