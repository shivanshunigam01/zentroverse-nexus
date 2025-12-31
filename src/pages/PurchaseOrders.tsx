import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Download, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderQuery,
} from "@/redux/services/purchaseSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PurchaseOrderForm from "@/components/PurchaseOrderForm";

const getStatusBadge = (status: string) => {
  const variants: {
    [key: string]: "default" | "secondary" | "destructive" | "outline";
  } = {
    Received: "default",
    Approved: "secondary",
    Pending: "outline",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

export default function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useGetPurchaseOrderQuery({ page: 1, limit: 200 });
  const orders = data?.data ?? [];

  const filteredOrders = orders.filter(
    (order: any) =>
      (order?.orderNo ?? order?.poNo ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order?.vendorName ?? order?.vendor ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (v: number) => {
    try {
      return `₹${v.toLocaleString()}`;
    } catch {
      return String(v);
    }
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePurchaseOrder] = useDeletePurchaseOrderMutation();

  const handleDeletePart = (partNoOrId: string) => {
    const id = partNoOrId;
    deletePurchaseOrder({ id })
      .unwrap()
      .then(() => toast.success("Part deleted"))
      .catch(() => toast.error("Delete failed"));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Purchase Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage supplier purchase orders
          </p>
        </div>
          <div className="flex gap-2">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingId(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
          New Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Part" : "Add New Part"}
                </DialogTitle>
                <DialogDescription>
                  Enter the details of the spare part
                </DialogDescription>
              </DialogHeader>
              {/* Stock form component handles both add and edit when id provided */}
              {/* StockForm handles add/update; pass editingId when editing */}
              <PurchaseOrderForm
                id={editingId}
                onDone={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast.success("Exporting purchase orders")}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    PO Number
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Vendor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Items
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Payment
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders?.map((order: any) => (
                  <tr
                    key={order._id ?? order.id ?? order.orderNo}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-foreground font-medium">
                      {order.orderNo ?? order.poNo}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {order.vendorName ?? order.vendor}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">
                      {(order.orderedParts || []).length}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                      {formatCurrency(
                        order.grandTotal ?? order.orderValue ?? 0
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {order.paymentStatus || order.paidAmount
                        ? `${order.paymentStatus ?? ""} (${formatCurrency(
                            order.paidAmount ?? 0
                          )})`
                        : ""}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const dbId = order._id ?? order.id ?? null;
                            if (!dbId) {
                              toast.error(
                                "Cannot edit item: missing database id"
                              );
                              return;
                            }
                            setEditingId(String(dbId));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeletePart(
                              order._id ??
                                order.id ??
                                order.partNumber ??
                                order.partNo
                            )
                          }
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
