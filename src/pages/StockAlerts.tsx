import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";
import {
  useGetStockAlertsQuery,
  useGetStockAlertByIDQuery,
  useAddStockAlertMutation,
  useUpdateStockAlertMutation,
  useDeleteStockAlertMutation,
} from "@/redux/services/stockAlertsSlice";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ---------------- Schema ---------------- */

const schema = z.object({
  jobCardNo: z.string().optional(),
  vehicleNo: z.string().optional(),
  vendorName: z.string().optional(),
  inwardNo: z.string().optional(),
  inwardDate: z.string().optional(),

  alertType: z.enum([
    "Low Stock",
    "Out of Stock",
    "Reorder Required",
    "Expiring Soon",
    "Slow Moving",
  ]),

  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  status: z.enum(["Active", "Acknowledged", "Resolved", "Ignored"]),

  partNo: z.string().min(1, "Part No is required"),
  partName: z.string().min(1, "Part Name is required"),
  brand: z.string().optional(),

  currentQty: z.preprocess((v) => Number(v), z.number().optional()),
  minStockLevel: z.preprocess((v) => Number(v), z.number().optional()),
  purchasePrice: z.preprocess((v) => Number(v), z.number().optional()),

  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/* ---------------- Component ---------------- */

export default function StockAlerts() {
  const { data } = useGetStockAlertsQuery({ page: 1, limit: 1000 });

  const [addStockAlert] = useAddStockAlertMutation();
  const [updateStockAlert] = useUpdateStockAlertMutation();
  const [deleteStockAlert] = useDeleteStockAlertMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: editingData } = useGetStockAlertByIDQuery(
    editingId ? { id: editingId } : ({} as any),
    { skip: !editingId }
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alertType: "Low Stock",
      priority: "Medium",
      status: "Active",
    },
  });

  /* ---------------- Edit Mode ---------------- */

  useEffect(() => {
    if (editingData?.data) {
      reset(editingData.data);
    }
  }, [editingData, reset]);

  /* ---------------- Submit ---------------- */

  const onSubmit = async (values: FormValues) => {
    try {
      if (editingId) {
        await updateStockAlert({ id: editingId, body: values }).unwrap();
        toast.success("Stock alert updated");
      } else {
        await addStockAlert(values).unwrap();
        toast.success("Stock alert created");
      }
      reset();
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  /* ---------------- Delete ---------------- */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this stock alert?")) return;
    await deleteStockAlert({ id }).unwrap();
    toast.success("Deleted");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* ---------- Form ---------- */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Job Card No" {...register("jobCardNo")} />
              <Input placeholder="Vehicle No" {...register("vehicleNo")} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="Vendor" {...register("vendorName")} />
              <Input placeholder="Inward No" {...register("inwardNo")} />
              <Input type="date" {...register("inwardDate")} />
            </div>

            {/* ---------- Selects ---------- */}
            <div className="grid grid-cols-3 gap-4">
              <Controller
                name="alertType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Alert Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Reorder Required">
                        Reorder Required
                      </SelectItem>
                      <SelectItem value="Expiring Soon">
                        Expiring Soon
                      </SelectItem>
                      <SelectItem value="Slow Moving">Slow Moving</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Ignored">Ignored</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Input placeholder="Part No" {...register("partNo")} />
              <Input placeholder="Part Name" {...register("partName")} />
              <Input placeholder="Brand" {...register("brand")} />
              <Input
                type="number"
                placeholder="Current Qty"
                {...register("currentQty")}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                type="number"
                placeholder="Min Stock"
                {...register("minStockLevel")}
              />
              <Input
                type="number"
                placeholder="Purchase Price"
                {...register("purchasePrice")}
              />
              <Input placeholder="Notes" {...register("notes")} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update Alert" : "Create Alert"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ---------- Table ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Alert No
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Alert Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Part Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Part No
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Brand
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Vendor
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Current Qty
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Min Stock
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                  Priority
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-nowrap text-muted-foreground">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-sm font-medium text-nowrap text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.data?.map((item: any) => (
                <tr
                  key={item?._id ?? item?.alertNo}
                  className="border-b border-border hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-foreground font-medium">
                    {item?.alertNo}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {item?.alertType}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {item?.partName}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {item?.partNo}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {item?.brand}
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">
                    {item?.vendorName}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-foreground">
                    {item?.currentQty}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-foreground">
                    {item?.minStockLevel}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-foreground">
                    {item?.priority}
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item?.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingId(item._id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
