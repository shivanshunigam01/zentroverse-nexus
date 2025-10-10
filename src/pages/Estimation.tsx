import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Printer, Send, Trash2, Eye, Edit as EditIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [estimations, setEstimations] = useState(estimationsData);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const calculateTotal = (item: any) => {
    const partTotal = item.qty * item.rate;
    const subtotal = partTotal + item.labourCost;
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  };

  const grandTotal = items.reduce((sum, item) => sum + calculateTotal(item), 0);

  const handleCreateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const newEst = {
      id: `EST-${String(Object.values(estimations).flat().length + 1).padStart(3, '0')}`,
      jobNo: `JC-2024-${String(Object.values(estimations).flat().length + 1).padStart(3, '0')}`,
      customer: "New Customer",
      vehicle: "Vehicle Details",
      date: new Date().toISOString().split('T')[0],
      amount: `₹${grandTotal.toFixed(0)}`
    };
    setEstimations({
      ...estimations,
      requested: [...estimations.requested, newEst]
    });
    setIsNewDialogOpen(false);
    toast.success("Estimate created successfully!");
  };

  const handleDeleteEstimate = () => {
    if (!deleteId) return;
    const updatedEstimations = { ...estimations };
    Object.keys(updatedEstimations).forEach(key => {
      updatedEstimations[key as keyof typeof updatedEstimations] = 
        updatedEstimations[key as keyof typeof updatedEstimations].filter((est: any) => est.id !== deleteId);
    });
    setEstimations(updatedEstimations);
    setDeleteId(null);
    toast.success("Estimate deleted successfully!");
  };

  const handleGenerateInvoice = () => {
    toast.success("Invoice generated! Download starting...");
    // Simulate PDF download
    setTimeout(() => {
      const blob = new Blob([`Invoice for ${grandTotal.toFixed(2)}`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.pdf';
      a.click();
      URL.revokeObjectURL(url);
    }, 500);
  };

  const updateItemQuantity = (index: number, field: string, value: number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
    toast.info("Item removed");
  };

  const addNewItem = () => {
    setItems([...items, { part: "New Part", labour: "New Labour", qty: 1, rate: 0, labourCost: 0, tax: 18 }]);
    toast.success("New item added");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Estimation</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage service estimates</p>
        </div>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Estimate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Estimate</DialogTitle>
              <DialogDescription>Enter details for the new estimate</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEstimate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input id="customer" placeholder="Enter customer name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Details</Label>
                <Input id="vehicle" placeholder="e.g., Maruti Swift" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration No</Label>
                <Input id="regNo" placeholder="e.g., MH 01 AB 1234" required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Estimate</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
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
                          <td className="py-3 px-4 text-sm">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedEstimate(est); toast.info("Viewing estimate"); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedEstimate(est); toast.info("Editing estimate"); }}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(est.id)}>
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
                      <Input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItemQuantity(idx, 'qty', Number(e.target.value))}
                        className="w-16 text-center" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input 
                        type="number" 
                        value={item.rate} 
                        onChange={(e) => updateItemQuantity(idx, 'rate', Number(e.target.value))}
                        className="w-24 text-right" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input 
                        type="number" 
                        value={item.labourCost} 
                        onChange={(e) => updateItemQuantity(idx, 'labourCost', Number(e.target.value))}
                        className="w-24 text-right" 
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Input 
                        type="number" 
                        value={item.tax} 
                        onChange={(e) => updateItemQuantity(idx, 'tax', Number(e.target.value))}
                        className="w-16 text-center" 
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                      ₹{calculateTotal(item).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(idx)}>
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

          <div className="flex justify-between items-center">
            <Button variant="outline" className="gap-2" onClick={addNewItem}>
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => toast.success("Estimate saved")}>
                <Save className="h-4 w-4" />
                Save Estimate
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => toast.success("Printing estimate")}>
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button className="gap-2" onClick={handleGenerateInvoice}>
                <Send className="h-4 w-4" />
                Generate Invoice
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this estimate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEstimate} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
