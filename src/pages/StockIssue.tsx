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
import { useGetStockIssuesQuery } from "@/redux/services/stockIssuesSlice";

export default function StockIssue() {
  const {data} = useGetStockIssuesQuery({
    page:1,
    limit: 1000
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Stock Issue</h1>
          <p className="text-sm text-muted-foreground mt-1">Issue parts to job cards or technicians</p>
        </div>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">New Stock Issue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jobcard">Job Card</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="counter">Counter Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobCard">Job Card / Technician</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jc1">JC-2024-001</SelectItem>
                  <SelectItem value="jc2">JC-2024-002</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="part">Select Part</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Search and select part" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">Engine Oil 5W-30</SelectItem>
                <SelectItem value="p2">Air Filter</SelectItem>
                <SelectItem value="p3">Brake Pads</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="Enter quantity" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input id="issueDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input id="remarks" placeholder="Optional remarks" />
          </div>

          <div className="flex justify-end">
            <Button className="gap-2" onClick={() => toast.success("Stock issued successfully!")}>
              <Save className="h-4 w-4" />
              Issue Stock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
