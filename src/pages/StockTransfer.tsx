import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StockTransfer() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stock Transfer</h1>
          <p className="text-sm text-muted-foreground mt-1">Transfer stock between workshops</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">New Stock Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromWorkshop">From Workshop</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select workshop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w1">Main Workshop - Mumbai</SelectItem>
                  <SelectItem value="w2">Branch - Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="toWorkshop">To Workshop</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select workshop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w1">Main Workshop - Mumbai</SelectItem>
                  <SelectItem value="w2">Branch - Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transferDate">Transfer Date</Label>
            <Input id="transferDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label>Items to Transfer</Label>
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select part" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Engine Oil 5W-30</SelectItem>
                    <SelectItem value="p2">Air Filter</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Quantity" />
                <Input placeholder="Remarks" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => toast.success("Stock transfer initiated!")}>
              <Save className="h-4 w-4" />
              Process Transfer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
