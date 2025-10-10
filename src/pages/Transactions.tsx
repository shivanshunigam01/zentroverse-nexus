import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const expensesData = [
  { id: "EXP-001", type: "Purchase", vendor: "Auto Parts Ltd", amount: "₹45,600", date: "2024-01-15", remarks: "Bulk order" },
  { id: "EXP-002", type: "Salary", vendor: "Staff", amount: "₹85,000", date: "2024-01-01", remarks: "Monthly salary" },
  { id: "EXP-003", type: "Rent", vendor: "Property Owner", amount: "₹35,000", date: "2024-01-01", remarks: "Workshop rent" },
];

const paymentsData = [
  { id: "PAY-001", vendor: "Auto Parts Ltd", amount: "₹45,600", date: "2024-01-15", mode: "Bank Transfer", remarks: "PO-2024-001" },
  { id: "PAY-002", vendor: "Spare World Inc", amount: "₹28,400", date: "2024-01-14", mode: "Cheque", remarks: "PO-2024-002" },
];

const collectionsData = [
  { id: "COL-001", customer: "Rajesh Kumar", jobCard: "JC-2024-001", amount: "₹12,500", date: "2024-01-15", mode: "Cash" },
  { id: "COL-002", customer: "Priya Sharma", jobCard: "JC-2024-002", amount: "₹8,750", date: "2024-01-15", mode: "UPI" },
];

export default function Transactions() {
  const [expenses, setExpenses] = useState(expensesData);
  const [payments, setPayments] = useState(paymentsData);
  const [collections, setCollections] = useState(collectionsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'expense' | 'payment' | 'collection' | 'bank'>('expense');

  const openDialog = (type: typeof dialogType) => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    if (dialogType === 'expense') {
      const newExpense = {
        id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
        type: formData.get('type') as string,
        vendor: formData.get('vendor') as string,
        amount: `₹${formData.get('amount')}`,
        date: formData.get('date') as string,
        remarks: formData.get('remarks') as string
      };
      setExpenses([...expenses, newExpense]);
    } else if (dialogType === 'payment') {
      const newPayment = {
        id: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
        vendor: formData.get('vendor') as string,
        amount: `₹${formData.get('amount')}`,
        date: formData.get('date') as string,
        mode: formData.get('mode') as string,
        remarks: formData.get('remarks') as string
      };
      setPayments([...payments, newPayment]);
    } else if (dialogType === 'collection') {
      const newCollection = {
        id: `COL-${String(collections.length + 1).padStart(3, '0')}`,
        customer: formData.get('customer') as string,
        jobCard: formData.get('jobCard') as string,
        amount: `₹${formData.get('amount')}`,
        date: formData.get('date') as string,
        mode: formData.get('mode') as string
      };
      setCollections([...collections, newCollection]);
    }
    
    setIsDialogOpen(false);
    toast.success(`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} added successfully!`);
  };

  const handleExport = () => {
    toast.success("Exporting transactions...");
    setTimeout(() => {
      const blob = new Blob(["Transaction Data Export"], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions-export.csv';
      a.click();
      URL.revokeObjectURL(url);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Financial transactions management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button className="gap-2" onClick={() => openDialog('expense')}>
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="bank">Bank Deposit</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Expense Records</CardTitle>
              <Button onClick={() => openDialog('expense')}>Add Expense</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{exp.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{exp.type}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{exp.vendor}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{exp.amount}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{exp.date}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{exp.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Vendor Payments</CardTitle>
              <Button onClick={() => openDialog('payment')}>Add Payment</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Payment ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vendor</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mode</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((pay) => (
                      <tr key={pay.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{pay.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{pay.vendor}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{pay.amount}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{pay.date}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{pay.mode}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{pay.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Customer Collections</CardTitle>
              <Button onClick={() => openDialog('collection')}>Add Collection</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Collection ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Card</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map((col) => (
                      <tr key={col.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{col.id}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{col.customer}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{col.jobCard}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{col.amount}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{col.date}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{col.mode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Bank Deposit Records</CardTitle>
              <Button onClick={() => openDialog('bank')}>Add Deposit</Button>
            </CardHeader>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Bank deposit records will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}</DialogTitle>
            <DialogDescription>Enter transaction details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {dialogType === 'expense' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="type">Expense Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Salary">Salary</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor/Payee</Label>
                  <Input name="vendor" id="vendor" placeholder="Enter vendor name" required />
                </div>
              </>
            )}
            {dialogType === 'payment' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor Name</Label>
                  <Input name="vendor" id="vendor" placeholder="Enter vendor name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Payment Mode</Label>
                  <Select name="mode" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {dialogType === 'collection' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input name="customer" id="customer" placeholder="Enter customer name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobCard">Job Card Number</Label>
                  <Input name="jobCard" id="jobCard" placeholder="e.g., JC-2024-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Payment Mode</Label>
                  <Select name="mode" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {dialogType === 'bank' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input name="bankName" id="bankName" placeholder="Enter bank name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slipNo">Deposit Slip No</Label>
                  <Input name="slipNo" id="slipNo" placeholder="Enter slip number" required />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input name="amount" id="amount" type="number" placeholder="Enter amount" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input name="date" id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input name="remarks" id="remarks" placeholder="Optional notes" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
