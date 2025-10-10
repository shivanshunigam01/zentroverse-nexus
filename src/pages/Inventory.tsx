import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Upload, Edit, Trash2 } from "lucide-react";
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

const inventoryData = [
  { partNo: "P001", name: "Engine Oil 5W-30", brand: "Castrol", category: "Lubricants", qoh: 50, purchasePrice: 380, sellingPrice: 450, tax: 18 },
  { partNo: "P002", name: "Air Filter", brand: "Bosch", category: "Filters", qoh: 30, purchasePrice: 650, sellingPrice: 850, tax: 18 },
  { partNo: "P003", name: "Brake Pads", brand: "Brembo", category: "Brakes", qoh: 20, purchasePrice: 1800, sellingPrice: 2200, tax: 18 },
  { partNo: "P004", name: "Spark Plugs", brand: "NGK", category: "Ignition", qoh: 100, purchasePrice: 280, sellingPrice: 350, tax: 18 },
  { partNo: "P005", name: "Battery 12V", brand: "Exide", category: "Electrical", qoh: 15, purchasePrice: 3800, sellingPrice: 4500, tax: 28 },
];

const statsData = [
  { title: "Total Items", value: "1,248", color: "text-primary" },
  { title: "Low Stock Items", value: "23", color: "text-warning" },
  { title: "Total Value", value: "₹12.4L", color: "text-success" },
  { title: "Out of Stock", value: "5", color: "text-destructive" },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [inventory, setInventory] = useState(inventoryData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPart = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPart = {
      partNo: formData.get('partNo') as string,
      name: formData.get('partName') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      qoh: Number(formData.get('qoh')),
      purchasePrice: Number(formData.get('purchasePrice')),
      sellingPrice: Number(formData.get('sellingPrice')),
      tax: Number(formData.get('tax'))
    };
    setInventory([...inventory, newPart]);
    toast.success("Part added to inventory!");
    setIsDialogOpen(false);
  };

  const handleDeletePart = (partNo: string) => {
    setInventory(inventory.filter(item => item.partNo !== partNo));
    toast.success("Part deleted successfully!");
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
    const csvContent = inventory.map(item => 
      `${item.partNo},${item.name},${item.brand},${item.category},${item.qoh},${item.purchasePrice},${item.sellingPrice},${item.tax}`
    ).join('\n');
    const blob = new Blob([`Part No,Name,Brand,Category,QoH,Purchase Price,Selling Price,Tax\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Inventory exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your spare parts inventory</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Inventory CSV</DialogTitle>
                <DialogDescription>Select a CSV file to import parts into inventory</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input 
                    id="csvFile" 
                    type="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Part No, Name, Brand, Category, QoH, Purchase Price, Selling Price, Tax
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUploadCSV}>Upload</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Part
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Part</DialogTitle>
                <DialogDescription>Enter the details of the new spare part</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPart} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="partNo">Part Number</Label>
                    <Input name="partNo" id="partNo" placeholder="e.g., P001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partName">Part Name</Label>
                    <Input name="partName" id="partName" placeholder="e.g., Engine Oil" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input name="brand" id="brand" placeholder="e.g., Castrol" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lubricants">Lubricants</SelectItem>
                        <SelectItem value="Filters">Filters</SelectItem>
                        <SelectItem value="Brakes">Brakes</SelectItem>
                        <SelectItem value="Ignition">Ignition</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qoh">Quantity on Hand</Label>
                    <Input name="qoh" id="qoh" type="number" placeholder="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase Price</Label>
                    <Input name="purchasePrice" id="purchasePrice" type="number" placeholder="₹ 0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">Selling Price</Label>
                    <Input name="sellingPrice" id="sellingPrice" type="number" placeholder="₹ 0" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax %</Label>
                  <Input name="tax" id="tax" type="number" placeholder="18" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Part</Button>
                </div>
              </form>
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
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Part No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Brand</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">QoH</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Purchase Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Selling Price</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tax %</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.partNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{item.partNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{item.name}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{item.brand}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{item.category}</td>
                        <td className="py-3 px-4 text-sm text-center">
                          <span className={item.qoh < 25 ? "text-warning font-medium" : "text-foreground"}>
                            {item.qoh}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">₹{item.purchasePrice}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">₹{item.sellingPrice}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-center">{item.tax}%</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => toast.info("Editing part")}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePart(item.partNo)}>
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
