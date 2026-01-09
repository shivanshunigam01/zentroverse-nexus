import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Download, Trash2 } from "lucide-react";
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
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "@/redux/services/customers";
import CustomerForm from "@/components/customer/CustomerForm";

export default function Customers() {
  const [tab, setTab] = useState<"individual" | "corporate">("individual");
  const { data: customers } = useGetCustomersQuery({
    page: 1,
    limit: 1000,
    type: tab,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleDeleteCustomer = (customerId: string) => {
    deleteCustomer({ id: customerId })
      .unwrap()
      .then(() => toast.success("Customer deleted"))
      .catch(() => toast.error("Delete failed"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your customer database
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter customer details</DialogDescription>
            </DialogHeader>
            <CustomerForm
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

      <Tabs defaultValue="individual">
        <TabsList>
          <TabsTrigger value="individual" onClick={() => setTab("individual")}>
            Individual
          </TabsTrigger>
          <TabsTrigger value="corporate" onClick={() => setTab("corporate")}>
            Corporate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search customers..." className="pl-10" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toast.success("Exporting customers")}
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
                        Customer ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Mobile
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Address
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Created By
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers?.data?.map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                          {customer?.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {customer?.customerName}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {customer?.mobileNo}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {customer?.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {customer?.address?.addressLine1}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {customer?.createdBy?.name}
                        </td>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const dbId = customer._id ?? customer.id ?? null;
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
                              handleDeleteCustomer(customer._id ?? customer.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search corporate customers..."
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toast.success("Exporting customers")}
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
                        Company ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Company Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        GSTIN
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Address
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers?.data?.map((company) => (
                      <tr
                        key={company?.id}
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                          {company?.id}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {company?.companyName}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {company?.mobileNo}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {company?.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {company?.gstin}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {company?.address?.addressLine1}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const dbId = company._id ?? company.id ?? null;
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
                                handleDeleteCustomer(company._id ?? company.id)
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
