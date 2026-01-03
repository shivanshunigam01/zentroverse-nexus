import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Upload, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useGetStocksQuery,
  useAddStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} from "@/redux/services/stock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import StockForm from "@/components/StockForm";

const statsData = [
  { title: "Total Items", value: "1,248", color: "text-primary" },
  { title: "Low Stock Items", value: "23", color: "text-warning" },
  { title: "Total Value", value: "₹12.4L", color: "text-success" },
  { title: "Out of Stock", value: "5", color: "text-destructive" },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { data: stocksData, isLoading: stocksLoading } = useGetStocksQuery({
    page: 1,
    limit: 200,
  });
  const [deleteStock] = useDeleteStockMutation();

  useEffect(() => {
    if (stocksData?.data && Array.isArray(stocksData.data)) {
      setInventory(stocksData.data);
    }
  }, [stocksData]);

  const filteredInventory = inventory.filter(
    (item) =>
      (item.partName || item.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.brand || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.partNumber || item.partNo || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Inventory delegates add/update to StockForm; no form state here

  const handleDeletePart = (partNoOrId: string) => {
    // find id from inventory (accept either partNo or id)
    const item = inventory.find(
      (i) =>
        (i.partNumber || i.partNo) === partNoOrId ||
        i._id === partNoOrId ||
        i.id === partNoOrId
    );
    if (!item) {
      toast.error("Item not found");
      return;
    }
    const id = item._id || item.id;
    deleteStock({ id })
      .unwrap()
      .then(() => toast.success("Part deleted"))
      .catch(() => toast.error("Delete failed"));
  };

  const handleUploadCSV = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    // Simulate CSV processing
    toast.success(`Uploading ${selectedFile.name}...`);
    setTimeout(() => {
      toast.success("CSV uploaded and processed successfully!");
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
    }, 1500);
  };

  const handleExport = () => {
    const csvContent = inventory
      .map(
        (item) =>
          `${item.partNo},${item.name},${item.brand},${item.category},${item.qoh},${item.purchasePrice},${item.sellingPrice},${item.tax}`
      )
      .join("\n");
    const blob = new Blob(
      [
        `Part No,Name,Brand,Category,QoH,Purchase Price,Selling Price,Tax\n${csvContent}`,
      ],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Inventory exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your spare parts inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Inventory CSV</DialogTitle>
                <DialogDescription>
                  Select a CSV file to import parts into inventory
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Part No, Name, Brand, Category, QoH, Purchase Price,
                    Selling Price, Tax
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUploadCSV}>Upload</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingId(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Part" : "Add New Part"}
                </DialogTitle>
                <DialogDescription>
                  Enter the details of the spare part
                </DialogDescription>
              </DialogHeader>
              {/* Stock form component handles both add and edit when id provided */}
              {/* StockForm handles add/update; pass editingId when editing */}
              <StockForm
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search parts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={handleExport}>
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
                        Part No
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Brand
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Category
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        QoH
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Purchase Price
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Selling Price
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Tax %
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Selling w/ Tax
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Total Value
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Created
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr
                        key={
                          item._id || item.id || item.partNumber || item.partNo
                        }
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground font-medium">
                          {item.partNumber ?? item.partNo}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {item.partName ?? item.name}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {item.brand}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {item.category}
                        </td>
                        <td className="py-3 px-4 text-sm text-center">
                          <span
                            className={
                              Number(item.quantityOnHand ?? item.qoh) < 25
                                ? "text-warning font-medium"
                                : "text-foreground"
                            }
                          >
                            {item.quantityOnHand ?? item.qoh}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">
                          ₹{item.purchasePrice}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">
                          ₹{item.sellingPrice}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-center">
                          {item.taxPercent ?? item.tax}%
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">
                          ₹
                          {item.sellingPriceWithTax ??
                            item.sellingPriceWithTax ??
                            ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">
                          ₹{item.totalValue ?? ""}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-center">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const dbId = item._id ?? item.id ?? null;
                                if (!dbId) {
                                  toast.error('Cannot edit item: missing database id');
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
                                handleDeletePart(
                                  item._id ??
                                    item.id ??
                                    item.partNumber ??
                                    item.partNo
                                )
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

        <TabsContent value="orders">
          <Card className="border-border">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Purchase orders view</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements">
          <Card className="border-border">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Stock movements view</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
