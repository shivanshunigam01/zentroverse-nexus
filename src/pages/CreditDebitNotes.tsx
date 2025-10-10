import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Eye, Printer } from "lucide-react";
import { toast } from "sonner";

const creditNotes = [
  { noteNo: "CN-001", invoiceNo: "INV-2024-001", jobCard: "JC-2024-001", date: "2024-01-15", amount: "₹1,200", reason: "Parts return" },
  { noteNo: "CN-002", invoiceNo: "INV-2024-005", jobCard: "JC-2024-005", date: "2024-01-13", amount: "₹800", reason: "Service discount" },
];

const debitNotes = [
  { noteNo: "DN-001", invoiceNo: "INV-2024-003", jobCard: "JC-2024-003", date: "2024-01-14", amount: "₹500", reason: "Additional charges" },
];

export default function CreditDebitNotes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Credit & Debit Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage financial adjustments</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success("Creating new note")}>
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <Tabs defaultValue="credit">
        <TabsList>
          <TabsTrigger value="credit">Credit Notes</TabsTrigger>
          <TabsTrigger value="debit">Debit Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="credit" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Credit Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Note No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Card</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditNotes.map((note) => (
                      <tr key={note.noteNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{note.noteNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.invoiceNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.jobCard}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{note.date}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{note.amount}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing note")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Printing note")}>
                              <Printer className="h-4 w-4" />
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

        <TabsContent value="debit" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Debit Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Note No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Card</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reason</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debitNotes.map((note) => (
                      <tr key={note.noteNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{note.noteNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.invoiceNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.jobCard}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{note.date}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">{note.amount}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{note.reason}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing note")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Printing note")}>
                              <Printer className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}
