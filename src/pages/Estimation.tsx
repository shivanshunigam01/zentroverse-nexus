import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Printer, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

const estimationsData = {
  requested: [
    { id: "EST-001", jobNo: "JC-2024-001", customer: "Rajesh Kumar", vehicle: "Maruti Swift", date: "2024-01-15", amount: "₹12,500" },
    { id: "EST-002", jobNo: "JC-2024-003", customer: "Amit Patel", vehicle: "Hyundai Creta", date: "2024-01-14", amount: "₹15,200" },
  ],
  approved: [
    { id: "EST-003", jobNo: "JC-2024-002", customer: "Priya Sharma", vehicle: "Honda City", date: "2024-01-15", amount: "₹8,750" },
  ],
  pending: [
    { id: "EST-004", jobNo: "JC-2024-004", customer: "Sneha Desai", vehicle: "Toyota Innova", date: "2024-01-14", amount: "₹6,800" },
  ],
};

const estimateItems = [
  { part: "Engine Oil 5W-30", labour: "Oil Change", qty: 4, rate: 450, labourCost: 500, tax: 18 },
  { part: "Air Filter", labour: "Filter Replacement", qty: 1, rate: 850, labourCost: 200, tax: 18 },
  { part: "Brake Pads", labour: "Brake Service", qty: 1, rate: 2200, labourCost: 800, tax: 18 },
];

export default function Estimation() {
  const [activeTab, setActiveTab] = useState("requested");
  const [items, setItems] = useState(estimateItems);

  const calculateTotal = (item: any) => {
    const partTotal = item.qty * item.rate;
    const subtotal = partTotal + item.labourCost;
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Estimation</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage service estimates</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Creating new estimate")}>
          <Plus className="h-4 w-4" />
          New Estimate
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="requested">Requested ({estimationsData.requested.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({estimationsData.approved.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({estimationsData.pending.length})</TabsTrigger>
        </TabsList>

        {Object.entries(estimationsData).map(([key, data]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Estimate ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job No</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((est) => (
                        <tr key={est.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-foreground font-medium">{est.id}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{est.jobNo}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{est.customer}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{est.vehicle}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{est.date}</td>
                          <td className="py-3 px-4 text-sm text-foreground font-medium text-right">{est.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Estimate Details - EST-001</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Part</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Labour</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Rate</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Labour Cost</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tax %</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-foreground">{item.part}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{item.labour}</td>
                    <td className="py-3 px-4">
                      <Input type="number" value={item.qty} className="w-16 text-center" />
                    </td>
                    <td className="py-3 px-4">
                      <Input type="number" value={item.rate} className="w-24 text-right" />
                    </td>
                    <td className="py-3 px-4">
                      <Input type="number" value={item.labourCost} className="w-24 text-right" />
                    </td>
                    <td className="py-3 px-4">
                      <Input type="number" value={item.tax} className="w-16 text-center" />
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                      ₹{calculateTotal(item).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => toast.info("Removing item")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td colSpan={6} className="py-3 px-4 text-right text-sm font-medium text-foreground">
                    Grand Total:
                  </td>
                  <td className="py-3 px-4 text-right text-lg font-bold text-primary">
                    ₹{grandTotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Estimate saved")}>
              <Save className="h-4 w-4" />
              Save Estimate
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Printing estimate")}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Estimate sent to customer")}>
              <Send className="h-4 w-4" />
              Send to Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
