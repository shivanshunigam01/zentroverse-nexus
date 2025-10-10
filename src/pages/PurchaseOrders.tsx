import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Download } from "lucide-react";
import { toast } from "sonner";

const purchaseOrdersData = [
  { poNo: "PO-2024-001", vendor: "Auto Parts Ltd", date: "2024-01-15", items: 12, amount: "₹45,600", status: "Approved" },
  { poNo: "PO-2024-002", vendor: "Spare World Inc", date: "2024-01-14", items: 8, amount: "₹28,400", status: "Pending" },
  { poNo: "PO-2024-003", vendor: "Motor Solutions", date: "2024-01-13", items: 15, amount: "₹62,800", status: "Received" },
  { poNo: "PO-2024-004", vendor: "Parts Depot", date: "2024-01-12", items: 6, amount: "₹18,200", status: "Approved" },
  { poNo: "PO-2024-005", vendor: "Quick Parts Supply", date: "2024-01-11", items: 20, amount: "₹95,400", status: "Received" },
];

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Received": "default",
    "Approved": "secondary",
    "Pending": "outline",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
};

export default function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = purchaseOrdersData.filter(order =>
    order.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Purchase Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage supplier purchase orders</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Creating new purchase order")}>
          <Plus className="h-4 w-4" />
          New Purchase Order
        </Button>
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
            <Button variant="outline" size="icon" onClick={() => toast.success("Exporting purchase orders")}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">PO Number</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.poNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{order.poNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{order.vendor}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{order.items}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">{order.amount}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing PO details")}>
                          <Eye className="h-4 w-4" />
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
