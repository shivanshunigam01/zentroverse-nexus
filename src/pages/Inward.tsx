import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetStockInwardsQuery,
  useGetStockInwardByIDQuery,
  useAddStockInwardMutation,
  useUpdateStockInwardMutation,
  useDeleteStockInwardMutation,
} from "@/redux/services/stockInwards";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const partSchema = z.object({
  partNumber: z.string().min(1),
  partName: z.string().min(1),
  quantity: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0)
  ),
  rate: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().min(0)
  ),
  amount: z
    .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0))
    .optional(),
  remarks: z.string().optional(),
  _id: z.string().optional(),
});

const schema = z.object({
  inwardNo: z.string().optional(),
  orderNo: z.string().optional(),
  jobCardNo: z.string().optional(),
  regNo: z.string().optional(),
  vendorName: z.string().optional(),
  orderDate: z.string().optional(),
  inwardDate: z.string().optional(),
  receiptNo: z.string().optional(),
  items: z.array(partSchema).min(1),
  totalQuantity: z
    .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0))
    .optional(),
  inwardValue: z
    .preprocess((v) => (v === "" ? undefined : Number(v)), z.number().min(0))
    .optional(),
  isVerified: z.boolean().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  stockUpdated: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Inward() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data, isLoading } = useGetStockInwardsQuery({ page: 1, limit: 1000 });
  const { data: existing } = useGetStockInwardByIDQuery(
    { id: editingId || "" },
    { skip: !editingId }
  );
  const [addStockInward] = useAddStockInwardMutation();
  const [updateStockInward] = useUpdateStockInwardMutation();
  const [deleteStockInward] = useDeleteStockInwardMutation();

  const { control, handleSubmit, register, reset, watch } = useForm<FormValues>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        items: [
          { partNumber: "", partName: "", quantity: 0, rate: 0, amount: 0 },
        ],
      },
    }
  );

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (existing?.data) {
      const d = existing.data;
      replace(
        (d.items || []).map((it: any) => ({
          partNumber: it.partNumber,
          partName: it.partName,
          quantity: it.quantity,
          rate: it.rate,
          amount: it.amount,
          remarks: it.remarks,
          _id: it._id,
        }))
      );
      reset({
        inwardNo: d.inwardNo,
        orderNo: d.orderNo,
        jobCardNo: d.jobCardNo,
        regNo: d.regNo,
        vendorName: d.vendorName,
        orderDate: d.orderDate ? d.orderDate.split("T")[0] : undefined,
        inwardDate: d.inwardDate ? d.inwardDate.split("T")[0] : undefined,
        receiptNo: d.receiptNo,
        items: d.items,
        totalQuantity: d.totalQuantity,
        inwardValue: d.inwardValue,
        isVerified: d.isVerified,
        status: d.status,
        notes: d.notes,
        stockUpdated: d.stockUpdated,
      });
    }
  }, [existing, replace, reset]);

  const onSubmit = (values: FormValues) => {
    const body = { ...values };
    if (editingId) {
      updateStockInward({ id: editingId, body })
        .unwrap()
        .then(() => {
          toast.success("Updated inward");
          setEditingId(null);
          reset();
        })
        .catch(() => toast.error("Update failed"));
      reset();
    } else {
      addStockInward(body)
        .unwrap()
        .then(() => {
          toast.success("Inward saved");
          reset();
        })
        .catch(() => toast.error("Save failed"));
      reset();
    }
  };

  const handleDelete = (id?: string) => {
    if (!id) {
      toast.error("Missing id");
      return;
    }
    deleteStockInward({ id })
      .unwrap()
      .then(() => toast.success("Deleted"))
      .catch(() => toast.error("Delete failed"));
  };

  const itemsWatch = watch("items");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Goods Inward
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record incoming stock from vendors
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">New Goods Inward</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Inward No</Label>
                <Input {...register("inwardNo")} />
              </div>
              <div className="space-y-2">
                <Label>Order No</Label>
                <Input {...register("orderNo")} />
              </div>
              <div className="space-y-2">
                <Label>Job Card No</Label>
                <Input {...register("jobCardNo")} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Reg No</Label>
                <Input {...register("regNo")} />
              </div>
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input {...register("vendorName")} />
              </div>
              <div className="space-y-2">
                <Label>Receipt No</Label>
                <Input {...register("receiptNo")} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input type="date" {...register("orderDate")} />
              </div>
              <div className="space-y-2">
                <Label>Inward Date</Label>
                <Input type="date" {...register("inwardDate")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Received">Received</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input {...register("notes")} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      partNumber: "",
                      partName: "",
                      quantity: 0,
                      rate: 0,
                      amount: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <div className="border border-border rounded-lg p-4 space-y-2">
                {fields.map((f, idx) => (
                  <div key={f.id} className="grid grid-cols-6 gap-2 items-end">
                    <Controller
                      control={control}
                      name={`items.${idx}.partNumber` as any}
                      render={({ field }) => (
                        <Input {...field} placeholder="Part No" />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`items.${idx}.partName` as any}
                      render={({ field }) => (
                        <Input {...field} placeholder="Part Name" />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`items.${idx}.quantity` as any}
                      render={({ field }) => (
                        <Input type="number" {...field} placeholder="Qty" />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`items.${idx}.rate` as any}
                      render={({ field }) => (
                        <Input type="number" {...field} placeholder="Rate" />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`items.${idx}.amount` as any}
                      render={({ field }) => (
                        <Input type="number" {...field} placeholder="Amount" />
                      )}
                    />
                    <div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="col-span-6">
                      <Label>Remarks</Label>
                      <Controller
                        control={control}
                        name={`items.${idx}.remarks` as any}
                        render={({ field }) => <Input {...field} />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Total Quantity</Label>
                <Input
                  value={(itemsWatch || []).reduce(
                    (s: number, it: any) => s + Number(it.quantity || 0),
                    0
                  )}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Inward Value</Label>
                <Input
                  value={(itemsWatch || []).reduce(
                    (s: number, it: any) => s + Number(it.amount || 0),
                    0
                  )}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Updated</Label>
                <Controller
                  control={control}
                  name="stockUpdated"
                  render={({ field }) => (
                    <Select
                      onValueChange={(v) => field.onChange(v === "true")}
                      value={field.value ? "true" : "false"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Stock Updated" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2" type="submit">
                <Save className="h-4 w-4" />
                {editingId ? "Update Inward" : "Save Inward"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

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
                    Inward No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Vendor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Order No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Receipt No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Inward Date
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Items
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Inward Value
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
                      {inward?.inwardNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.vendorName}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.orderNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {inward?.receiptNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {inward?.inwardDate
                        ? new Date(inward.inwardDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">
                      {(inward?.items || []).length}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                      ₹{inward?.inwardValue ?? ""}
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
