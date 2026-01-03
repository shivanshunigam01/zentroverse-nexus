import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddStockTransferMutation,
  useDeleteStockTransferMutation,
  useGetStockTransfersQuery,
  useUpdateStockTransferMutation,
} from "@/redux/services/stockTransfer";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* ---------------- Schema ---------------- */

const itemSchema = z.object({
  partNo: z.string().min(1, "Part No required"),
  partName: z.string().min(1, "Part Name required"),
  brand: z.string().optional(),
  quantity: z.preprocess(v => Number(v), z.number().min(1)),
  remarks: z.string().optional(),
});

const schema = z.object({
  fromWorkshop: z.string().min(1),
  toWorkshop: z.string().min(1),
  transferDate: z.string().min(1),
  expectedDeliveryDate: z.string().optional(),
  items: z.array(itemSchema).min(1),

  transferReason: z.enum([
    "Stock Balancing",
    "Urgent Requirement",
    "Workshop Closure",
    "Excess Stock",
    "Other",
  ]),

  transferMethod: z.enum([
    "Vehicle",
    "Courier",
    "Hand Carry",
    "Other",
  ]),

  status: z.enum([
    "Draft",
    "Pending Approval",
    "Approved",
    "In Transit",
    "Delivered",
    "Received",
    "Cancelled",
  ]),

  vehicleNo: z.string().optional(),
  driverName: z.string().optional(),
  driverContact: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function StockTransfer() {
  const { data } = useGetStockTransfersQuery({ page: 1, limit: 1000 });
  const [addStockTransfer] = useAddStockTransferMutation();
  const [updateStockTransfer] = useUpdateStockTransferMutation();
  const [deleteStockTransfer] = useDeleteStockTransferMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fromWorkshop: "",
      toWorkshop: "",
      transferDate: "",
      expectedDeliveryDate: "",
      items: [{ partNo: "", partName: "", brand: "", quantity: 1, remarks: "" }],
      transferReason: "Stock Balancing",
      transferMethod: "Vehicle",
      status: "Draft",
      vehicleNo: "",
      driverName: "",
      driverContact: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  /* ---------------- Edit Mode ---------------- */

  useEffect(() => {
    if (!editingId) return;
    const t = data?.data?.find((x: any) => x._id === editingId);
    if (t) reset(t);
  }, [editingId, data, reset]);

  /* ---------------- Submit ---------------- */

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingId) {
        await updateStockTransfer({ id: editingId, body: values }).unwrap();
        toast.success("Stock transfer updated");
      } else {
        await addStockTransfer(values).unwrap();
        toast.success("Stock transfer created");
      }
      reset();
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  /* ---------------- Delete ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transfer?")) return;
    await deleteStockTransfer({ id }).unwrap();
    toast.success("Deleted");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* ---------- Form ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="From Workshop" {...register("fromWorkshop")} />
              <Input placeholder="To Workshop" {...register("toWorkshop")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="date" {...register("transferDate")} />
              <Input type="date" {...register("expectedDeliveryDate")} />
            </div>

            {/* ---------- Items ---------- */}
            <div className="border rounded p-4 space-y-2">
              {fields.map((f, i) => (
                <div key={f.id} className="grid grid-cols-6 gap-2 items-end">
                  <Input {...register(`items.${i}.partNo`)} placeholder="Part No" />
                  <Input {...register(`items.${i}.partName`)} placeholder="Part Name" />
                  <Input type="number" {...register(`items.${i}.quantity`)} placeholder="Qty" />
                  <Input {...register(`items.${i}.remarks`)} placeholder="Remarks" />
                  <Button type="button" size="icon" variant="ghost" onClick={() => remove(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ partNo: "", partName: "", quantity: 1 })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            {/* ---------- Enums ---------- */}
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="transferReason"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Transfer Reason" /></SelectTrigger>
                    <SelectContent>
                      {["Stock Balancing","Urgent Requirement","Workshop Closure","Excess Stock","Other"].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="transferMethod"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Transfer Method" /></SelectTrigger>
                    <SelectContent>
                      {["Vehicle","Courier","Hand Carry","Other"].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      {["Draft","Pending Approval","Approved","In Transit","Delivered","Received","Cancelled"].map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Vehicle No" {...register("vehicleNo")} />
              <Input placeholder="Driver Name" {...register("driverName")} />
              <Input placeholder="Driver Contact" {...register("driverContact")} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update Transfer" : "Create Transfer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---------- Table ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Workshop Transfers</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th>From</th><th>To</th><th>Reason</th><th>Method</th>
                <th>Items</th><th>Status</th><th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((t: any) => (
                <tr key={t._id} className="border-b">
                  <td>{t.fromWorkshop}</td>
                  <td>{t.toWorkshop}</td>
                  <td>{t.transferReason}</td>
                  <td>{t.transferMethod}</td>
                  <td className="text-center">{t.items?.length}</td>
                  <td>{t.status}</td>
                  <td className="text-center">
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(t._id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
