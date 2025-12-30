import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Eye, Edit, Printer, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetAllJobCardsQuery,
  useCreateJobCardMutation,
  useUpdateJobCardMutation,
  useDeleteJobCardMutation,
} from "@/redux/services/jobCardSlice";
import type { CreateJobCardRequest, JobCard } from "@/types/jobCard";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
  const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Delivered": "default",
    "delivered": "default",
    "In Progress": "secondary",
    "in_progress": "secondary",
    "Pending": "outline",
    "pending": "outline",
    "Invoice": "secondary",
    "invoice": "secondary",
    "Cancelled": "destructive",
    "cancelled": "destructive",
  };
  const key = (status || '').toString().toLowerCase();
  const item = variants[key] || 'default';
  return <Badge variant={item as "default" | "secondary" | "destructive" | "outline"}>{status}</Badge>;
};

export default function JobCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  // API hooks
  const {
    data: jobCardsResponse,
    isLoading,
    error,
    refetch,
  } = useGetAllJobCardsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
    page,
    limit,
    sortBy: "arrivalDate",
    sortOrder: "desc",
  });

  const [createJobCard, { isLoading: isCreating }] = useCreateJobCardMutation();
  const [updateJobCard, { isLoading: isUpdating }] = useUpdateJobCardMutation();
  const [deleteJobCard, { isLoading: isDeleting }] = useDeleteJobCardMutation();

  // Debug: Log the response to see what we're getting
  useEffect(() => {
    if (jobCardsResponse) {
      // Normalize logging for either array or object shape
      if (Array.isArray(jobCardsResponse)) {
        console.log("Job Cards Response:", jobCardsResponse);
      } else if ('jobCards' in jobCardsResponse && Array.isArray(jobCardsResponse.jobCards)) {
        console.log("Job Cards Response:", jobCardsResponse.jobCards);
      } else {
        console.log("Job Cards Response:", jobCardsResponse);
      }
    }
    if (error) {
      console.error("Job Cards Error:", error);
    }
  }, [jobCardsResponse, error]);

  // Handle different response structures
  // API might return: { data: [...] } or { success: true, data: [...] } or just [...]
  const rawJobCards = Array.isArray(jobCardsResponse)
    ? jobCardsResponse
    : jobCardsResponse?.jobCards && Array.isArray(jobCardsResponse.jobCards)
      ? jobCardsResponse.jobCards
      : [];

  // Map API response fields to component expected fields
  const jobCards: JobCard[] = rawJobCards.map((card: any) => ({
    ...card,
    // Map API field names to component field names
    jobCardNo: card.jobNumber || card.jobCardNo,
    customerName: card.customer || card.customerName,
    mobileNo: card.mobile || card.mobileNo,
    // Normalize status format (in_progress -> In Progress)
    status: card.status
      ? card.status
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      : card.status,
  }));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const handleCreateJobCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent double submission
    if (isCreating) return;

    // Store form reference before async operation
    const form = e.currentTarget;
    const formData = new FormData(form);

    const jobCardData: CreateJobCardRequest = {
      regNo: formData.get("regNo") as string,
      vehicle: formData.get("vehicle") as string,
      customerName: formData.get("customerName") as string,
      mobileNo: formData.get("mobileNo") as string,
      arrivalDate: formData.get("arrivalDate") as string,
      arrivalTime: formData.get("arrivalTime") as string,
      rfeNo: formData.get("rfeNo") as string || undefined,
      invoiceNo: formData.get("invoiceNo") as string || undefined,
      serviceType: formData.get("serviceType") as string || undefined,
      status: (formData.get("status") as any) || "Pending",
      notes: formData.get("notes") as string || undefined,
    };

    try {
      const result = await createJobCard(jobCardData).unwrap();

      // Check if response explicitly indicates failure
      if (result && result.success === false) {
        // API returned success: false
        const errorMessage = result.message || "Failed to create job card";
        toast.error(errorMessage);
        return;
      }

      // Success case - reset form before closing dialog to avoid null reference
      try {
        if (form) {
          form.reset();
        }
      } catch (resetError) {
        // Silently handle form reset errors (form might be unmounted)
        console.warn("Form reset error:", resetError);
      }

      toast.success("Job card created successfully!");
      setIsDialogOpen(false);

      // Regenerate next job card number after creation
      refetch().catch(() => {
        // Silently handle refetch errors to avoid showing error toast
      });
    } catch (error: any) {
      // Network error or API error (non-2xx status)
      // Only show error if we haven't already shown success
      const errorMessage = error?.data?.message || error?.message || "Failed to create job card";
      toast.error(errorMessage);
    }
  };

  const handleEditJobCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJobCard) return;

    const formData = new FormData(e.currentTarget);

    const jobCardData: Partial<CreateJobCardRequest> = {
      jobCardNo: formData.get("jobCardNo") as string,
      regNo: formData.get("regNo") as string,
      vehicle: formData.get("vehicle") as string,
      customerName: formData.get("customerName") as string,
      mobileNo: formData.get("mobileNo") as string,
      arrivalDate: formData.get("arrivalDate") as string,
      arrivalTime: formData.get("arrivalTime") as string,
      rfeNo: formData.get("rfeNo") as string || undefined,
      invoiceNo: formData.get("invoiceNo") as string || undefined,
      serviceType: formData.get("serviceType") as string || undefined,
      status: (formData.get("status") as any) || selectedJobCard.status,
      notes: formData.get("notes") as string || undefined,
    };

    try {
      await updateJobCard({ id: selectedJobCard._id, data: jobCardData }).unwrap();
      toast.success("Job card updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedJobCard(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update job card");
    }
  };

  const handleDeleteJobCard = async () => {
    if (!selectedJobCard) return;

    try {
      await deleteJobCard(selectedJobCard._id).unwrap();
      toast.success("Job card deleted successfully!");
      setIsDeleteDialogOpen(false);
      setSelectedJobCard(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete job card");
    }
  };

  const handleViewJobCard = (jobCard: JobCard) => {
    setSelectedJobCard(jobCard);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (jobCard: JobCard) => {
    setSelectedJobCard(jobCard);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (jobCard: JobCard) => {
    setSelectedJobCard(jobCard);
    setIsDeleteDialogOpen(true);
  };

  const handleExport = () => {
    if (jobCards.length === 0) {
      toast.error("No job cards to export");
      return;
    }

    // Prepare CSV headers
    const headers = [
      "Job Card No",
      "Reg No",
      "Invoice No",
      "Service Type",
      "Vehicle",
      "Status",
      "Customer Name",
      "Mobile No",
      "Arrival Date",
      "Arrival Time",
      "RFE No",
      "Notes",
    ];

    // Prepare CSV rows
    const csvRows = jobCards.map((job) => {
      const formatDateForCSV = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return dateString;
          return format(date, "yyyy-MM-dd");
        } catch {
          return dateString;
        }
      };

      return [
        job.jobCardNo || job.jobNumber || "",
        job.regNo || "",
        job.invoiceNo || "",
        job.serviceType || "",
        job.vehicle || "",
        job.status || "",
        job.customerName || job.customer || "",
        job.mobileNo || job.mobile || "",
        formatDateForCSV(job.arrivalDate || job.createdAt),
        job.arrivalTime || "",
        job.rfeNo || "",
        (job.notes || "").replace(/"/g, '""'), // Escape quotes in CSV
      ].map((field) => `"${field}"`).join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.map((h) => `"${h}"`).join(","), ...csvRows].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-cards-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${jobCards.length} job card(s) successfully!`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return format(date, "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all workshop job cards</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Job Card
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job Card</DialogTitle>
              <DialogDescription>Enter the details to create a new job card</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJobCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="regNo">Registration No</Label>
                  <Input id="regNo" name="regNo" placeholder="e.g., MH 01 AB 1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Input id="vehicle" name="vehicle" placeholder="e.g., Maruti Swift" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Input id="serviceType" name="serviceType" placeholder="e.g., Full Service" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" name="customerName" placeholder="Enter name" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mobileNo">Mobile No</Label>
                  <Input id="mobileNo" name="mobileNo" type="tel" placeholder="Enter mobile" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Arrival Date</Label>
                  <Input
                    id="arrivalDate"
                    name="arrivalDate"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    name="arrivalTime"
                    type="time"
                    defaultValue={new Date().toTimeString().slice(0, 5)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfeNo">RFE No</Label>
                  <Input id="rfeNo" name="rfeNo" placeholder="RFE Number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNo">Invoice No</Label>
                  <Input id="invoiceNo" name="invoiceNo" placeholder="Invoice Number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="Pending">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" placeholder="Additional notes" rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Job Card"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by customer, vehicle, or reg no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <p className="text-destructive font-medium">Error loading job cards</p>
              <p className="text-sm text-muted-foreground">
                {(error as any)?.data?.message || (error as any)?.message || "Please check your API connection"}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                Retry
              </Button>
            </div>
          ) : jobCards.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No job cards found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job Card No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Reg No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mobile No</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Arrival Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Arrival Time</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobCards.map((job) => (
                      <tr key={job._id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4 text-sm text-foreground font-medium">{job.jobCardNo || job.jobNumber}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.regNo}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.invoiceNo || "-"}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.serviceType || "-"}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.vehicle}</td>
                        <td className="py-3 px-4 text-sm">{getStatusBadge(job.status as string)}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.customerName || job.customer}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{job.mobileNo || job.mobile || "-"}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(job.arrivalDate || job.createdAt || "")}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {job.arrivalTime || "-"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewJobCard(job)}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(job)}
                              title="Edit job card"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(job)}
                              title="Delete job card"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {(() => {
                const pagination = !Array.isArray(jobCardsResponse) && jobCardsResponse?.pagination;
                return pagination && pagination.pages > 1 ? (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= pagination.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                ) : null;
              })()}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog - Read Only */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Card Details</DialogTitle>
            <DialogDescription>View job card information</DialogDescription>
          </DialogHeader>
          {selectedJobCard && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Card No</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.jobCardNo || selectedJobCard.jobNumber}</div>
                </div>
                <div className="space-y-2">
                  <Label>Registration No</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.regNo}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.vehicle}</div>
                </div>
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.serviceType || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.customerName || selectedJobCard.customer}</div>
                </div>
                <div className="space-y-2">
                  <Label>Mobile No</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.mobileNo || selectedJobCard.mobile || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Arrival Date</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">
                    {selectedJobCard.arrivalDate
                      ? formatDate(selectedJobCard.arrivalDate)
                      : selectedJobCard.createdAt
                        ? formatDate(selectedJobCard.createdAt)
                        : "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Arrival Time</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.arrivalTime || "-"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>RFE No</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.rfeNo || "-"}</div>
                </div>
                <div className="space-y-2">
                  <Label>Invoice No</Label>
                  <div className="p-2 rounded-md bg-secondary text-sm">{selectedJobCard.invoiceNo || "-"}</div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="p-2">{getStatusBadge(selectedJobCard.status as string)}</div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <div className="p-2 rounded-md bg-secondary text-sm min-h-[80px] whitespace-pre-wrap">{selectedJobCard.notes || "-"}</div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setSelectedJobCard(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Card</DialogTitle>
            <DialogDescription>Update the job card details</DialogDescription>
          </DialogHeader>
          {selectedJobCard && (
            <form onSubmit={handleEditJobCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-jobCardNo">Job Card No</Label>
                  <Input
                    id="edit-jobCardNo"
                    name="jobCardNo"
                    defaultValue={selectedJobCard.jobCardNo || selectedJobCard.jobNumber}
                    readOnly
                    className="bg-secondary cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-regNo">Registration No</Label>
                  <Input
                    id="edit-regNo"
                    name="regNo"
                    defaultValue={selectedJobCard.regNo}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vehicle">Vehicle</Label>
                  <Input
                    id="edit-vehicle"
                    name="vehicle"
                    defaultValue={selectedJobCard.vehicle}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serviceType">Service Type</Label>
                  <Input
                    id="edit-serviceType"
                    name="serviceType"
                    defaultValue={selectedJobCard.serviceType || ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customerName">Customer Name</Label>
                  <Input
                    id="edit-customerName"
                    name="customerName"
                    defaultValue={selectedJobCard.customerName}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-mobileNo">Mobile No</Label>
                  <Input
                    id="edit-mobileNo"
                    name="mobileNo"
                    type="tel"
                    defaultValue={selectedJobCard.mobileNo}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-arrivalDate">Arrival Date</Label>
                  <Input
                    id="edit-arrivalDate"
                    name="arrivalDate"
                    type="date"
                    defaultValue={
                      selectedJobCard.arrivalDate
                        ? new Date(selectedJobCard.arrivalDate).toISOString().split("T")[0]
                        : ""
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-arrivalTime">Arrival Time</Label>
                  <Input
                    id="edit-arrivalTime"
                    name="arrivalTime"
                    type="time"
                    defaultValue={selectedJobCard.arrivalTime}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-rfeNo">RFE No</Label>
                  <Input
                    id="edit-rfeNo"
                    name="rfeNo"
                    defaultValue={selectedJobCard.rfeNo || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-invoiceNo">Invoice No</Label>
                  <Input
                    id="edit-invoiceNo"
                    name="invoiceNo"
                    defaultValue={selectedJobCard.invoiceNo || ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={selectedJobCard.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Invoice">Invoice</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  name="notes"
                  defaultValue={selectedJobCard.notes || ""}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedJobCard(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Job Card"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job card{" "}
              {selectedJobCard?.jobCardNo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJobCard}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
