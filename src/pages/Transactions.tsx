import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">Financial transactions management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => toast.success("Exporting transactions")}>
            <Download className="h-4 w-4" />
          </Button>
          <Button className="gap-2" onClick={() => toast.success("Adding new transaction")}>
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
            <CardHeader>
              <CardTitle className="text-foreground">Expense Records</CardTitle>
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
                    {expensesData.map((exp) => (
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
            <CardHeader>
              <CardTitle className="text-foreground">Vendor Payments</CardTitle>
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
                    {paymentsData.map((pay) => (
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
            <CardHeader>
              <CardTitle className="text-foreground">Customer Collections</CardTitle>
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
                    {collectionsData.map((col) => (
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
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Bank deposit records</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
