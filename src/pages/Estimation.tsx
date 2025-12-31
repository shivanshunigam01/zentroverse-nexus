import { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, Printer, Send, Trash2, Eye, Edit as EditIcon, ChevronDown, X } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCreateEstimateMutation,
  useDeleteEstimateMutation,
  useGetEstimatesQuery,
  useUpdateEstimateMutation,
  useUpdateEstimateStatusMutation,
  type Estimate,
  type EstimateItem,
} from "@/redux/api/estimationApi";
import { useGetJobCardByJobCardNoQuery } from "@/redux/services/jobCardSlice";
import html2pdf from "html2pdf.js";
import InvoiceTemplate from "./InvoiceTemplate";

export default function Estimation() {
  const [activeTab, setActiveTab] = useState("requested");
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [jobCardNo, setJobCardNo] = useState<string>("");
  const [jobCardNoToFetch, setJobCardNoToFetch] = useState<string | null>(null);

  const { data: allEstimates = [] } = useGetEstimatesQuery(undefined);
  
  const {
    data: estimates = [],
    isLoading,
  } = useGetEstimatesQuery(
    activeTab as "requested" | "approved" | "pending"
      ? { status: activeTab as "requested" | "approved" | "pending" }
      : undefined
  );

  const statusCounts = useMemo(() => {
    const counts = {
      requested: 0,
      approved: 0,
      pending: 0,
    };
    allEstimates.forEach((est) => {
      if (est.status in counts) {
        counts[est.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [allEstimates]);

  const [createEstimate, { isLoading: isCreating }] = useCreateEstimateMutation();
  const [updateEstimate, { isLoading: isUpdating }] = useUpdateEstimateMutation();
  const [updateEstimateStatus, { isLoading: isUpdatingStatus }] = useUpdateEstimateStatusMutation();
  const [deleteEstimate, { isLoading: isDeleting }] = useDeleteEstimateMutation();

  // Fetch job card when jobCardNoToFetch is set
  const {
    data: jobCardData,
    isLoading: isLoadingJobCard,
    error: jobCardError,
  } = useGetJobCardByJobCardNoQuery(jobCardNoToFetch || "", {
    skip: !jobCardNoToFetch || jobCardNoToFetch.trim() === "",
  });

  useEffect(() => {
    if (selectedEstimate) {
      setItems(selectedEstimate.items || []);
    } else {
      setItems([]);
    }
  }, [selectedEstimate]);

  const calculateTotal = (item: EstimateItem) => {
    const partTotal = item.qty * item.rate;
    const subtotal = partTotal + item.labourCost;
    const taxAmount = (subtotal * item.tax) / 100;
    return subtotal + taxAmount;
  };

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + calculateTotal(item), 0),
    [items]
  );

  const handleCreateEstimate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobCardNumber = String(formData.get("jobCardNo") || "").trim().toUpperCase();

    if (!jobCardNumber) {
      toast.error("Please enter a job card number");
      return;
    }

    // Check if job card exists
    if (jobCardError || !jobCardData) {
      toast.error("This job card does not exist");
      return;
    }

    const jobCard = jobCardData.data || (jobCardData as any).jobCard || jobCardData;
    const customerName = jobCard.customerName || jobCard.customer || "";
    const vehicleDetails = jobCard.vehicle || "";
    const registrationNo = jobCard.regNo || "";

    if (!customerName || !vehicleDetails) {
      toast.error("Job card is missing required information");
      return;
    }

    try {
      const created = await createEstimate({
        jobNo: jobCardNumber,
        customerName,
        vehicleDetails,
        registrationNo,
        items: [], // No default items
      }).unwrap();
      
      // Reset form before closing dialog
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      setJobCardNo("");
      setJobCardNoToFetch(null);
      setIsNewDialogOpen(false);
      setSelectedEstimate(null); // Don't auto-select, let user click "Add Details"
      setItems([]);
      toast.success("Estimate created successfully!");
    } catch (error: any) {
      console.error("Error creating estimate:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to create estimate";
      toast.error(errorMessage);
    }
  };

  const handleJobCardNoChange = (value: string) => {
    const trimmedValue = value.trim().toUpperCase();
    setJobCardNo(value);
    if (trimmedValue.length > 0) {
      setJobCardNoToFetch(trimmedValue);
    } else {
      setJobCardNoToFetch(null);
    }
  };

  const handleDeleteEstimate = async () => {
    if (!deleteId) return;
    try {
      await deleteEstimate(deleteId).unwrap();
      setDeleteId(null);
      if (selectedEstimate?._id === deleteId) {
        setSelectedEstimate(null);
        setItems([]);
      }
      toast.success("Estimate deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete estimate");
    }
  };

  const handleViewEstimate = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setItems(estimate.items || []);
    setIsEditMode(false);
  };

  const handleAddDetails = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setItems(estimate.items || []);
    setIsEditMode(false);
    setIsAddItemDialogOpen(true);
  };

  const handleEditEstimate = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setIsEditDialogOpen(true);
  };

  const generateInvoicePDF = () => {
    if (!invoiceRef.current || !selectedEstimate) return;

    html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: `Estimate-${selectedEstimate.estimateId}-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          windowWidth: 800,
          windowHeight: 1200
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(invoiceRef.current)
      .save();
  };

  const handleGenerateInvoice = () => {
    if (!selectedEstimate) {
      toast.error("Please select an estimate first");
      return;
    }

    if (!selectedEstimate.items || selectedEstimate.items.length === 0) {
      toast.error("Cannot generate PDF: Estimate has no items");
      return;
    }

    try {
      generateInvoicePDF();
      toast.success("Invoice PDF downloaded successfully!");
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.error(`Failed to generate PDF: ${error?.message || "Unknown error"}`);
    }
  };

  const handlePrintEstimate = () => {
    if (!invoiceRef.current || !selectedEstimate) {
      toast.error("Please select an estimate first");
      return;
    }

    if (!selectedEstimate.items || selectedEstimate.items.length === 0) {
      toast.error("Cannot print: Estimate has no items");
      return;
    }

    try {
      html2pdf()
        .set({
          margin: [15, 15, 15, 15],
          filename: `Estimate-${selectedEstimate.estimateId}-${new Date().toISOString().split("T")[0]}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            letterRendering: true,
            windowWidth: 800,
            windowHeight: 1200
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(invoiceRef.current)
        .outputPdf("dataurlnewwindow")
        .then(() => {
          toast.success("Opening print dialog...");
        })
        .catch((error: any) => {
          console.error("Error printing:", error);
          toast.error(`Failed to print estimate: ${error?.message || "Unknown error"}`);
        });
    } catch (error: any) {
      console.error("Error printing:", error);
      toast.error(`Failed to print estimate: ${error?.message || "Unknown error"}`);
    }
  };

  const updateItemQuantity = (index: number, field: keyof EstimateItem, value: number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const removeItem = async (index: number) => {
    if (!selectedEstimate) {
      toast.error("Please select an estimate first");
      return;
    }

    try {
      const updatedItems = items.filter((_, idx) => idx !== index);
      const updated = await updateEstimate({
        id: selectedEstimate._id,
        data: {
          items: updatedItems,
        },
      }).unwrap();
      setSelectedEstimate(updated);
      setItems(updated.items);
      toast.success("Item deleted successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete item");
    }
  };


  const handleUpdateEstimateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEstimate) return;

    const formData = new FormData(e.currentTarget);
    const customerName = String(formData.get("customer") || "").trim();
    const vehicleDetails = String(formData.get("vehicle") || "").trim();
    const registrationNo = String(formData.get("regNo") || "").trim();

    if (!customerName || !vehicleDetails) {
      toast.error("Customer name and vehicle details are required");
      return;
    }

    try {
      const updated = await updateEstimate({
        id: selectedEstimate._id,
        data: {
          customerName,
          vehicleDetails,
          registrationNo: registrationNo || undefined,
        },
      }).unwrap();
      setSelectedEstimate(updated);
      setIsEditDialogOpen(false);
      toast.success("Estimate details updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update estimate");
    }
  };

  const handleSaveEstimate = async () => {
    if (!selectedEstimate) {
      toast.error("Please select an estimate first");
      return;
    }
    try {
      const updated = await updateEstimate({
        id: selectedEstimate._id,
        data: {
          items,
        },
      }).unwrap();
      setSelectedEstimate(updated);
      setItems(updated.items);
      setIsEditMode(false);
      toast.success("Estimate saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save estimate");
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: EstimateItem = {
      part: String(formData.get("part") || "").trim(),
      labour: String(formData.get("labour") || "").trim(),
      qty: Number(formData.get("qty")) || 1,
      rate: Number(formData.get("rate")) || 0,
      labourCost: Number(formData.get("labourCost")) || 0,
      tax: Number(formData.get("tax")) || 18,
    };

    if (!newItem.part || !newItem.labour) {
      toast.error("Part and Labour are required");
      return;
    }

    if (!selectedEstimate) {
      toast.error("Please select an estimate first");
      return;
    }

    try {
      const updatedItems = [...items, newItem];
      const updated = await updateEstimate({
        id: selectedEstimate._id,
        data: {
          items: updatedItems,
        },
      }).unwrap();
      setSelectedEstimate(updated);
      setItems(updated.items);
      // Reset form before closing dialog
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      setIsAddItemDialogOpen(false);
      toast.success("Item added successfully!");
    } catch (error: any) {
      console.error("Error adding item:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to add item";
      toast.error(errorMessage);
    }
  };

  const handleEditItem = (index: number) => {
    setEditingItemIndex(index);
    setIsEditItemDialogOpen(true);
  };

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingItemIndex === null || !selectedEstimate) return;

    const formData = new FormData(e.currentTarget);
    const updatedItem: EstimateItem = {
      part: String(formData.get("part") || "").trim(),
      labour: String(formData.get("labour") || "").trim(),
      qty: Number(formData.get("qty")) || 1,
      rate: Number(formData.get("rate")) || 0,
      labourCost: Number(formData.get("labourCost")) || 0,
      tax: Number(formData.get("tax")) || 18,
    };

    if (!updatedItem.part || !updatedItem.labour) {
      toast.error("Part and Labour are required");
      return;
    }

    try {
      const updatedItems = [...items];
      updatedItems[editingItemIndex] = updatedItem;
      const grandTotal = updatedItems.reduce((sum, item) => sum + calculateTotal(item), 0);
      const updated = await updateEstimate({
        id: selectedEstimate._id,
        data: {
          items: updatedItems,
          grandTotal,
        },
      }).unwrap();
      setSelectedEstimate(updated);
      setItems(updated.items);
      setIsEditItemDialogOpen(false);
      setEditingItemIndex(null);
      toast.success("Item updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update item");
    }
  };

  const getAvailableStatuses = (currentStatus: string): string[] => {
    const allStatuses = ["requested", "approved", "pending"];
    return allStatuses.filter((status) => status !== currentStatus);
  };

  const handleStatusChange = async (estimateId: string, newStatus: "requested" | "approved" | "pending") => {
    try {
      await updateEstimateStatus({
        id: estimateId,
        status: newStatus,
      }).unwrap();
      toast.success(`Estimate status changed to ${newStatus}`);
      if (selectedEstimate?._id === estimateId) {
        const updatedEstimate = { ...selectedEstimate, status: newStatus };
        setSelectedEstimate(updatedEstimate);
      }
      setActiveTab(newStatus);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update estimate status");
    }
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
            <Button className="gap-2" disabled={isCreating}>
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
                <Label htmlFor="jobCardNo">Job Card Number</Label>
                <Input
                  id="jobCardNo"
                  name="jobCardNo"
                  value={jobCardNo}
                  onChange={(e) => handleJobCardNoChange(e.target.value)}
                  placeholder="Enter job card number"
                  required
                />
                {isLoadingJobCard && (
                  <p className="text-sm text-muted-foreground">Loading job card details...</p>
                )}
                {jobCardError && (
                  <p className="text-sm text-destructive">This job card does not exist</p>
                )}
                {jobCardData && (jobCardData.data || (jobCardData as any).jobCard) && (
                  <div className="mt-2 p-3 bg-muted rounded-md space-y-1">
                    {(() => {
                      const jobCard = jobCardData.data || (jobCardData as any).jobCard;
                      return (
                        <>
                          <p className="text-sm">
                            <span className="font-medium">Customer:</span> {jobCard.customerName || jobCard.customer}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Vehicle:</span> {jobCard.vehicle}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Registration:</span> {jobCard.regNo}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsNewDialogOpen(false);
                    setJobCardNo("");
                    setJobCardNoToFetch(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || isLoadingJobCard || !jobCardData}
                >
                  {isCreating ? "Creating..." : "Create Estimate"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="requested">
            Requested ({statusCounts.requested})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({statusCounts.approved})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({statusCounts.pending})
          </TabsTrigger>
        </TabsList>

        {["requested", "approved", "pending"].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            <Card className="border-border">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading estimates...</div>
                ) : estimates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No estimates found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
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
                        {(status === activeTab ? estimates : []).map((est) => (
                          <tr
                            key={est._id}
                            className="border-b border-border hover:bg-secondary/50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-foreground font-medium">
                              {est.estimateId}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">{est.jobNo}</td>
                            <td className="py-3 px-4 text-sm text-foreground">
                              {est.customerName}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">
                              {est.vehicleDetails}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(est.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                              ₹{est.grandTotal.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <div className="flex justify-end gap-2">
                                {est.items && est.items.length > 0 ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleViewEstimate(est)}
                                    title="View Estimate"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddDetails(est)}
                                    title="Add Details"
                                    className="gap-1"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add Details
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditEstimate(est)}
                                  title="Edit Estimate"
                                >
                                  <EditIcon className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      disabled={isUpdatingStatus}
                                      title="Change Status"
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {getAvailableStatuses(est.status).map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() =>
                                          handleStatusChange(
                                            est._id,
                                            status as "requested" | "approved" | "pending"
                                          )
                                        }
                                        className="cursor-pointer"
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeleteId(est._id)}
                                  disabled={isDeleting}
                                  title="Delete Estimate"
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedEstimate && (
        <Card className="border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-foreground">
                Estimate Details - {selectedEstimate.estimateId}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedEstimate(null);
                  setItems([]);
                  setIsEditMode(false);
                }}
                title="Close Estimate Details"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[20%]">Part</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[18%]">Labour</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-[8%]">Qty</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-[10%]">Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-[12%]">Labour Cost</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-[8%]">Tax %</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-[12%]">Total</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-[12%]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No items added yet
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="border-b border-border">
                        <td className="py-3 px-4 text-sm text-foreground">
                          {isEditMode ? (
                            <Input
                              value={item.part}
                              onChange={(e) => {
                                const updatedItems = [...items];
                                updatedItems[idx] = { ...updatedItems[idx], part: e.target.value };
                                setItems(updatedItems);
                              }}
                              className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                            />
                          ) : (
                            item.part
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {isEditMode ? (
                            <Input
                              value={item.labour}
                              onChange={(e) => {
                                const updatedItems = [...items];
                                updatedItems[idx] = { ...updatedItems[idx], labour: e.target.value };
                                setItems(updatedItems);
                              }}
                              className="border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                            />
                          ) : (
                            item.labour
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateItemQuantity(idx, "qty", Number(e.target.value) || 0)}
                              className="w-16 text-center mx-auto"
                              min="0"
                            />
                          ) : (
                            item.qty
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={item.rate}
                              onChange={(e) => updateItemQuantity(idx, "rate", Number(e.target.value) || 0)}
                              className="w-24 text-right ml-auto"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            `₹${item.rate.toFixed(2)}`
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={item.labourCost}
                              onChange={(e) => updateItemQuantity(idx, "labourCost", Number(e.target.value) || 0)}
                              className="w-24 text-right ml-auto"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            `₹${item.labourCost.toFixed(2)}`
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isEditMode ? (
                            <Input
                              type="number"
                              value={item.tax}
                              onChange={(e) => updateItemQuantity(idx, "tax", Number(e.target.value) || 0)}
                              className="w-16 text-center mx-auto"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            `${item.tax}%`
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground font-medium text-right">
                          ₹{calculateTotal(item).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditItem(idx)}
                              title="Edit Item"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(idx)}
                              title="Delete Item"
                              disabled={isUpdating}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsAddItemDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              <div className="flex gap-2">
                {isEditMode && (
                  <>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setIsEditMode(false);
                        if (selectedEstimate) {
                          setItems(selectedEstimate.items || []);
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleSaveEstimate}
                      disabled={isUpdating}
                    >
                      <Save className="h-4 w-4" />
                      {isUpdating ? "Saving..." : "Save Estimate"}
                    </Button>
                  </>
                )}
                <Button variant="outline" className="gap-2" onClick={handlePrintEstimate}>
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
      )}

      {/* Edit Estimate Details Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Estimate Details</DialogTitle>
            <DialogDescription>Update the estimate information</DialogDescription>
          </DialogHeader>
          {selectedEstimate && (
            <form onSubmit={handleUpdateEstimateDetails} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customer">Customer Name</Label>
                <Input
                  id="edit-customer"
                  name="customer"
                  defaultValue={selectedEstimate.customerName}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vehicle">Vehicle Details</Label>
                <Input
                  id="edit-vehicle"
                  name="vehicle"
                  defaultValue={selectedEstimate.vehicleDetails}
                  placeholder="e.g., Maruti Swift"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-regNo">Registration No</Label>
                <Input
                  id="edit-regNo"
                  name="regNo"
                  defaultValue={selectedEstimate.registrationNo || ""}
                  placeholder="e.g., MH 01 AB 1234"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Estimate"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>Enter details for the new item</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-part">Part</Label>
              <Input
                id="add-part"
                name="part"
                placeholder="Enter part name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-labour">Labour</Label>
              <Input
                id="add-labour"
                name="labour"
                placeholder="Enter labour description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-qty">Quantity</Label>
                <Input
                  id="add-qty"
                  name="qty"
                  type="number"
                  defaultValue="1"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-rate">Rate</Label>
                <Input
                  id="add-rate"
                  name="rate"
                  type="number"
                  defaultValue="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-labourCost">Labour Cost</Label>
                <Input
                  id="add-labourCost"
                  name="labourCost"
                  type="number"
                  defaultValue="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-tax">Tax %</Label>
                <Input
                  id="add-tax"
                  name="tax"
                  type="number"
                  defaultValue="18"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddItemDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update the item details</DialogDescription>
          </DialogHeader>
          {editingItemIndex !== null && items[editingItemIndex] && (
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-part">Part</Label>
                <Input
                  id="edit-item-part"
                  name="part"
                  defaultValue={items[editingItemIndex].part}
                  placeholder="Enter part name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-labour">Labour</Label>
                <Input
                  id="edit-item-labour"
                  name="labour"
                  defaultValue={items[editingItemIndex].labour}
                  placeholder="Enter labour description"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-qty">Quantity</Label>
                  <Input
                    id="edit-item-qty"
                    name="qty"
                    type="number"
                    defaultValue={items[editingItemIndex].qty}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-rate">Rate</Label>
                  <Input
                    id="edit-item-rate"
                    name="rate"
                    type="number"
                    defaultValue={items[editingItemIndex].rate}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-labourCost">Labour Cost</Label>
                  <Input
                    id="edit-item-labourCost"
                    name="labourCost"
                    type="number"
                    defaultValue={items[editingItemIndex].labourCost}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-tax">Tax %</Label>
                  <Input
                    id="edit-item-tax"
                    name="tax"
                    type="number"
                    defaultValue={items[editingItemIndex].tax}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditItemDialogOpen(false);
                    setEditingItemIndex(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Item"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Hidden Invoice Template for PDF Generation */}
      {selectedEstimate && (
        <div className="hidden">
          <InvoiceTemplate ref={invoiceRef} estimate={selectedEstimate} />
        </div>
      )}
    </div>
  );
}
