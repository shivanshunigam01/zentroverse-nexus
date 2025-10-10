import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const partsInventory = [
  { id: "P001", name: "Engine Oil 5W-30", brand: "Castrol", price: 450, stock: 50 },
  { id: "P002", name: "Air Filter", brand: "Bosch", price: 850, stock: 30 },
  { id: "P003", name: "Brake Pads", brand: "Brembo", price: 2200, stock: 20 },
  { id: "P004", name: "Spark Plugs", brand: "NGK", price: 350, stock: 100 },
  { id: "P005", name: "Battery 12V", brand: "Exide", price: 4500, stock: 15 },
];

const recentInvoices = [
  { invoiceNo: "INV-2024-001", customer: "Walk-in Customer", amount: "₹3,200", status: "Invoice", date: "2024-01-15" },
  { invoiceNo: "INV-2024-002", customer: "Rajesh Kumar", amount: "₹5,800", status: "Estimation", date: "2024-01-15" },
  { invoiceNo: "INV-2024-003", customer: "Priya Sharma", amount: "₹1,500", status: "Pre-Invoice", date: "2024-01-14" },
];

export default function CounterSales() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParts = partsInventory.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (part: any) => {
    const existing = cart.find(item => item.id === part.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === part.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...part, qty: 1 }]);
    }
    toast.success("Added to cart");
  };

  const updateQty = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info("Removed from cart");
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    toast.success("Invoice generated successfully!");
    setCart([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Counter Sales</h1>
          <p className="text-sm text-muted-foreground mt-1">Point of Sale system for spare parts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parts Search & Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parts by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredParts.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{part.name}</p>
                      <p className="text-sm text-muted-foreground">{part.brand} • Stock: {part.stock}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">₹{part.price}</span>
                      <Button size="sm" onClick={() => addToCart(part)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart & Billing */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center text-foreground">{item.qty}</span>
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18%):</span>
                  <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" disabled={cart.length === 0} onClick={handleCheckout}>
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Invoices */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.invoiceNo} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{inv.invoiceNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{inv.customer}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{inv.amount}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={inv.status === "Invoice" ? "default" : "outline"}>{inv.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{inv.date}</td>
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
