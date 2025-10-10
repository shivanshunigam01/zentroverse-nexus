import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const recentInwards = [
  { inwardNo: "INW-001", vendor: "Auto Parts Ltd", billNo: "BILL-2024-001", date: "2024-01-15", items: 12, amount: "₹45,600" },
  { inwardNo: "INW-002", vendor: "Spare World Inc", billNo: "BILL-2024-002", date: "2024-01-14", items: 8, amount: "₹28,400" },
  { inwardNo: "INW-003", vendor: "Motor Solutions", billNo: "BILL-2024-003", date: "2024-01-13", items: 15, amount: "₹62,800" },
];

export default function Inward() {
  const [items, setItems] = useState([{ part: "", qty: 0, rate: 0 }]);

  const addItem = () => {
    setItems([...items, { part: "", qty: 0, rate: 0 }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Goods Inward</h1>
          <p className="text-sm text-muted-foreground mt-1">Record incoming stock from vendors</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">New Goods Inward</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Auto Parts Ltd</SelectItem>
                  <SelectItem value="v2">Spare World Inc</SelectItem>
                  <SelectItem value="v3">Motor Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billNo">Bill Number</Label>
              <Input id="billNo" placeholder="Enter bill number" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freight">Freight Charges</Label>
              <Input id="freight" type="number" placeholder="₹ 0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount %</Label>
              <Input id="discount" type="number" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2">
                  <Input placeholder="Part name" />
                  <Input type="number" placeholder="Quantity" />
                  <Input type="number" placeholder="Rate" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => toast.success("Goods inward saved!")}>
              <Save className="h-4 w-4" />
              Save Inward
            </Button>
          </div>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Inward No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bill No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentInwards.map((inward) => (
                  <tr key={inward.inwardNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{inward.inwardNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{inward.vendor}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{inward.billNo}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{inward.date}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{inward.items}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">{inward.amount}</td>
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
