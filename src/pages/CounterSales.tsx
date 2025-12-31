import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  useGetStockQuery,
  useGetCounterSalesQuery,
  useCreateCounterSaleMutation,
  useDeleteCounterSaleMutation,
  useUpdateCounterSaleMutation,
  useCompleteCounterSaleMutation,
  useCancelCounterSaleMutation,
  useRefundCounterSaleMutation,
  useAddPaymentMutation,
  useGetInvoiceQuery,
} from "@/redux/services/counterSales";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function CounterSales() {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // form with validation for customer, payments and billDiscount
  const paymentSchema = z.object({
    amount: z.number().min(0, "Amount must be >= 0"),
    method: z.string().min(1, "Method required"),
    reference: z.string().optional(),
  });

  const formSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    mobileNo: z.string().min(1, "Mobile no is required"),
    regNo: z.string().optional(),
    payments: z.array(paymentSchema).min(1, "At least one payment is required"),
    billDiscount: z.number().min(0).optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const { control, handleSubmit, watch, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      mobileNo: "",
      regNo: "",
      payments: [{ amount: 0, method: 'Cash', reference: '' }],
      billDiscount: 0,
    },
    mode: 'onChange',
  });

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control,
    name: 'payments',
  });

  const { data: stockData, isLoading: stockLoading } = useGetStockQuery();
  const { data: salesListData, isLoading: salesLoading, refetch: refetchSales } = useGetCounterSalesQuery({ page: 1, limit: 20 });
  const [createCounterSale, { isLoading: creating }] = useCreateCounterSaleMutation();
  const [deleteCounterSale] = useDeleteCounterSaleMutation();
  const [updateCounterSale] = useUpdateCounterSaleMutation();
  const [completeCounterSale] = useCompleteCounterSaleMutation();
  const [cancelCounterSale] = useCancelCounterSaleMutation();
  const [refundCounterSale] = useRefundCounterSaleMutation();
  const [addPayment] = useAddPaymentMutation();

  // modal state for viewing/editing a sale
  const [activeSale, setActiveSale] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const partsInventory = useMemo(() => {
    // map backend stock shape to front-end expected fields
    if (!stockData?.data || !Array.isArray(stockData.data)) return [];
    return stockData.data.map((s: any) => ({
      id: s._id ?? s.partNo ?? s.id,
      name: s.partName ?? s.name ?? s.partNo,
      brand: s.brand ?? s.manufacturer ?? "",
      price: s.sellingPrice ?? s.price ?? s.unitPrice ?? 0,
      stock: s.stock ?? s.qty ?? 0,
      raw: s,
    }));
  }, [stockData]);

  const filteredParts = partsInventory?.filter((part: any) =>
    `${part.name} ${part.brand}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (part: any) => {
    const existing = cart?.find(item => item.id === part.id);
    if (existing) {
      setCart(cart?.map(item =>
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
  const totalBeforeDiscount = subtotal + tax;
  const watchedBillDiscount = Number(watch('billDiscount') || 0);
  const grandTotal = Math.max(0, totalBeforeDiscount - (watchedBillDiscount || 0));

  const handleCheckout = (formValues: FormValues) => {
    // build payload according to backend sample, using validated formValues
    const payload = {
      customerName: formValues.customerName || "Walk-in Customer",
      mobileNo: formValues.mobileNo || "",
      regNo: formValues.regNo || "",
      items: cart.map((c) => ({
        partNo: c.raw?.partNumber ?? c.raw?.partNo ?? c.id,
        quantity: c.qty,
        unitPrice: c.price,
        discount: c.discount ?? 0,
        discountType: c.discountType ?? "Flat",
      })),
      payments: (formValues.payments || []).map((p: any) => ({ amount: Number(p.amount || 0), method: p.method, reference: p.reference })),
      billDiscount: Number(formValues.billDiscount || 0),
    };

    createCounterSale(payload)
      .unwrap()
      .then((res) => {
        const saleNo = res?.saleNo || res?.data?.saleNo || res?.saleNoGenerated || '';
        toast.success(saleNo ? `Counter sale ${saleNo} created` : "Counter sale created successfully");
        setCart([]);
        reset();
        refetchSales();
      })
      .catch((err) => {
        const msg = err?.data?.message || err?.error || "Failed to create sale";
        toast.error(msg);
      });
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
                    {stockLoading && <div className="text-sm text-muted-foreground">Loading parts...</div>}
                    {filteredParts.map((part: any) => (
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <Controller
                    control={control}
                    name="customerName"
                    render={({ field }) => (
                      <Input placeholder="Customer Name" {...field} className="w-full" />
                    )}
                  />
                  <Controller
                    control={control}
                    name="mobileNo"
                    render={({ field }) => (
                      <Input placeholder="Mobile No" {...field} className="w-full" />
                    )}
                  />
                  <Controller
                    control={control}
                    name="regNo"
                    render={({ field }) => (
                      <Input placeholder="Reg No" {...field} className="w-full" />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 rounded border border-border">
                    <div className="flex-1 mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center text-foreground">{item.qty}</span>
                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* discount input */}
                      <Input
                        type="number"
                        value={String(item.discount ?? 0)}
                        onChange={(e) => {
                          const next = [...cart];
                          next[idx] = { ...next[idx], discount: Number(e.target.value || 0) };
                          setCart(next);
                        }}
                        className="w-20 text-right"
                      />

                      {/* discount type select */}
                      <select
                        value={item.discountType ?? 'Flat'}
                        onChange={(e) => {
                          const next = [...cart];
                          next[idx] = { ...next[idx], discountType: e.target.value };
                          setCart(next);
                        }}
                        className="border border-border rounded px-2 py-1 bg-transparent text-sm"
                      >
                        <option value="Flat">Flat</option>
                        <option value="Percent">Percent</option>
                      </select>

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
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Bill Discount:</span>
                  <Controller
                    control={control}
                    name="billDiscount"
                    render={({ field }) => (
                      <Input
                        type="number"
                        {...field}
                        className="w-28 text-right"
                        onChange={(e) => field.onChange(Number(e.target.value || 0))}
                        value={String(field.value ?? 0)}
                      />
                    )}
                  />
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total:</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">Payments</div>
                  <div className="space-y-2">
                    {paymentFields.map((pf, idx) => (
                      <div key={pf.id} className="flex items-center gap-2">
                        <Controller
                          control={control}
                          name={`payments.${idx}.amount` as any}
                          render={({ field }) => (
                            <Input
                              type="number"
                              {...field}
                              className="w-32"
                              onChange={(e) => field.onChange(Number(e.target.value || 0))}
                              value={String(field.value ?? 0)}
                            />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`payments.${idx}.method` as any}
                          render={({ field }) => (
                            <Input {...field} className="w-28" />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`payments.${idx}.reference` as any}
                          render={({ field }) => (
                            <Input {...field} placeholder="reference" className="w-36" />
                          )}
                        />

                        <Button size="icon" variant="ghost" onClick={() => removePayment(idx)}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => appendPayment({ amount: 0, method: 'Cash', reference: '' })}>
                      Add Payment
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="w-full" disabled={cart.length === 0 || !formState.isValid} onClick={handleSubmit(handleCheckout)}>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesLoading && (
                  <tr>
                    <td colSpan={6} className="py-4 px-4 text-sm text-muted-foreground">Loading...</td>
                  </tr>
                )}
                {salesListData?.data?.map((inv: any) => (
                  <tr key={inv._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{inv.saleNo}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{inv.customerName}</td>
                    <td className="py-3 px-4 text-sm text-foreground">₹{inv.totalAmount}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={inv.status === "Completed" ? "default" : "outline"}>{inv.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(inv.saleDate).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => { setActiveSale(inv); setIsModalOpen(true); }}>
                          View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => {
                          if (inv.status === 'Completed') { toast.error('Completed sale cannot be deleted'); return; }
                          deleteCounterSale({ id: inv._id })
                            .unwrap()
                            .then(() => toast.success('Deleted'))
                            .catch(() => toast.error('Delete failed'));
                        }}>
                          Delete
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
      {/* Modal - simple inline modal */}
      {isModalOpen && activeSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="text-white dark:bg-slate-900 rounded-lg w-full max-w-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sale {activeSale.saleNo}</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setIsModalOpen(false); setActiveSale(null); }}>Close</Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm">Customer: {activeSale.customerName}</div>
              <div className="text-sm">Mobile: {activeSale.mobileNo}</div>
              <div className="text-sm">Reg: {activeSale.regNo}</div>
              <div className="text-sm">Status: {activeSale.status}</div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => {
                    // complete
                    completeCounterSale({ id: activeSale._id })
                      .unwrap()
                      .then(() => { toast.success('Completed'); refetchSales(); setIsModalOpen(false); })
                      .catch(() => toast.error('Complete failed'));
                  }} disabled={activeSale.status !== 'Draft'}>Complete</Button>

                  <Button size="sm" onClick={() => {
                    // cancel
                    cancelCounterSale({ id: activeSale._id })
                      .unwrap()
                      .then(() => { toast.success('Cancelled'); refetchSales(); setIsModalOpen(false); })
                      .catch(() => toast.error('Cancel failed'));
                  }} disabled={activeSale.status !== 'Draft' && activeSale.status !== 'Partial'}>Cancel</Button>

                  <Button size="sm" onClick={() => {
                    // refund
                    refundCounterSale({ id: activeSale._id })
                      .unwrap()
                      .then(() => { toast.success('Refunded'); refetchSales(); setIsModalOpen(false); })
                      .catch(() => toast.error('Refund failed'));
                  }} disabled={activeSale.status !== 'Completed'}>Refund</Button>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium">Payments</h4>
                <div className="space-y-2">
                  {(activeSale.payments || []).map((p: any) => (
                    <div key={p._id || `${p.method}-${p.amount}`} className="flex justify-between text-sm">
                      <div>{p.method} - ₹{p.amount} {p.reference ? `(${p.reference})` : ''}</div>
                      <div className="text-muted-foreground">{new Date(p.paidAt || p.createdAt || Date.now()).toLocaleString()}</div>
                    </div>
                  ))}

                  <div className="mt-2 flex items-center gap-2">
                    <Input placeholder="Amount" id="modalPaymentAmount" className="w-32" />
                    <Input placeholder="Method (Cash|UPI|Card)" id="modalPaymentMethod" className="w-28" />
                    <Input placeholder="Reference" id="modalPaymentRef" className="w-36" />
                    <Button size="sm" onClick={() => {
                      const amountEl = document.getElementById('modalPaymentAmount') as HTMLInputElement | null;
                      const methodEl = document.getElementById('modalPaymentMethod') as HTMLInputElement | null;
                      const refEl = document.getElementById('modalPaymentRef') as HTMLInputElement | null;
                      const body = { amount: Number(amountEl?.value || 0), method: methodEl?.value || 'Cash', reference: refEl?.value || '' };
                      addPayment({ id: activeSale._id, body })
                        .unwrap()
                        .then(() => { toast.success('Payment added'); refetchSales(); setIsModalOpen(false); })
                        .catch(() => toast.error('Add payment failed'));
                    }}>Add Payment</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
