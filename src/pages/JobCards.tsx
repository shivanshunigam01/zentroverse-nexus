import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Download, Eye, Edit, Printer, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Dynamic data fetched from backend
const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

type JobRow = any;

const initialState = {
  schema: {} as Record<string, any>,
  rows: [] as JobRow[],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
};

const getStatusBadge = (status: string) => {
  // Normalize status codes and labels
  const mapping: { [key: string]: { label: string; variant: "default" | "secondary" | "destructive" | "outline" } } = {
    open: { label: 'Open', variant: 'outline' },
    in_progress: { label: 'In Progress', variant: 'secondary' },
    completed: { label: 'Completed', variant: 'default' },
    closed: { label: 'Closed', variant: 'destructive' },
  };
  const key = (status || '').toString().toLowerCase();
  const item = mapping[key] || { label: status || '', variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export default function JobCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [editingJob, setEditingJob] = useState<JobRow | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  // Fetch schema and first page
  useEffect(() => {
    fetchSchema();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-set dev test token in localStorage when running locally (makes Add/Edit work without manual step)
  useEffect(() => {
    if ((window.location.hostname === 'localhost' || import.meta.env.DEV) && !localStorage.getItem('token')) {
      (async () => {
        try {
          const res = await fetch(`${BASE}/api/auth/test-token`);
          const json = await res.json();
          if (res.ok && json.token) {
            localStorage.setItem('token', json.token);
            toast.success('Dev token set automatically');
          } else {
            console.warn('test-token endpoint responded without token', json);
          }
        } catch (e) {
          console.warn('Auto token fetch failed', e);
        }
      })();
    }
  }, []);

  useEffect(() => {
    // refetch when search or status changes
    const t = setTimeout(() => fetchData(1), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  const fetchSchema = async () => {
    try {
      const res = await fetch(`${BASE}/api/jobcards/schema`);
      const json = await res.json();
      setState((s) => ({ ...s, schema: json }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load schema");
    }
  };

  const fetchData = async (page = state.page) => {
    try {
      console.debug('fetchData called', { page, searchTerm, statusFilter, limit: state.limit });
      setState((s) => ({ ...s, loading: true }));
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(state.limit));
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`${BASE}/api/jobcards?${params.toString()}`);
      const json = await res.json();
      const rows = json.data || [];
      console.debug('fetchData result', { total: json.total, returned: rows.length });
      if (rows.length === 0 && (json.total === 0 || !json.total)) {
        toast.info('No job cards returned (backend returned 0 rows)');
      }
      setState((s) => ({ ...s, rows, total: json.total || 0, page: json.page || page, loading: false }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load job cards");
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const openEdit = async (job: JobRow) => {
    // Fetch fresh details from backend to ensure all fields are present for editing
    try {
      const id = job._id || job.id;
      const res = await fetch(`${BASE}/api/jobcards/${id}`);
      if (!res.ok) throw new Error('Failed to fetch job details');
      const full = await res.json();
      setEditingJob(full);
      setEditForm({
        title: full.title || '',
        vehicleMake: full.vehicleMake || '',
        model: full.vehicle || full.model || '',
        regNo: full.regNo || '',
        vin: full.vin || '',
        odometer: full.odometer || '',
        customerName: full.customer || '',
        mobile: full.mobile || '',
        email: full.email || '',
        concerns: full.description || '',
        advisor: full.assignedTo || '',
        advance: full.advance || '',
        insurance: full.insurance || '',
        status: full.status || '',
      });
      setIsEditOpen(true);
    } catch (err: any) {
      console.error('openEdit fetch failed', err);
      toast.error('Failed to load full job details, opening partial data');
      // Fallback to the row we already have
      setEditingJob(job);
      setEditForm({
        title: job.title || '',
        vehicleMake: job.vehicleMake || '',
        model: job.vehicle || job.model || '',
        regNo: job.regNo || '',
        vin: job.vin || '',
        odometer: job.odometer || '',
        customerName: job.customer || '',
        mobile: job.mobile || '',
        email: job.email || '',
        concerns: job.description || '',
        advisor: job.assignedTo || '',
        advance: job.advance || '',
        insurance: job.insurance || '',
      });
      setIsEditOpen(true);
    }
  }; 

  const handleEditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingJob) return;

    const payload: any = {
      title: editForm.title || editingJob.title,
      customer: editForm.customerName || editingJob.customer,
      assignedTo: editForm.advisor || editingJob.assignedTo,
      vehicle: editForm.model || editForm.vehicle || editingJob.vehicle,
      regNo: editForm.regNo || editingJob.regNo,
      vin: editForm.vin || editingJob.vin,
      odometer: editForm.odometer || editingJob.odometer,
      description: editForm.concerns || editingJob.description,
      mobile: editForm.mobile || editingJob.mobile,
      email: editForm.email || editingJob.email,
      advance: editForm.advance || editingJob.advance,
      insurance: editForm.insurance || editingJob.insurance,
      status: editForm.status || editingJob.status,
    };

    try {
      const token = localStorage.getItem("token");
      let res = await fetch(`${BASE}/api/jobcards/${editingJob._id || editingJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // If 401, attempt to fetch a fresh dev token and retry once
      if (res.status === 401) {
        try {
          const t = await fetch(`${BASE}/api/auth/test-token`);
          const tj = await t.json();
          if (t.ok && tj.token) {
            localStorage.setItem('token', tj.token);
          }
        } catch (e) {
          console.warn('Failed to refresh token', e);
        }
        const newToken = localStorage.getItem('token');
        res = await fetch(`${BASE}/api/jobcards/${editingJob._id || editingJob.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed");
      toast.success("Job card updated");
      setIsEditOpen(false);
      setEditingJob(null);
      setEditForm({});
      fetchData(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  }; 

  const handleDelete = async (job: JobRow) => {
    if (!confirm("Are you sure you want to delete this job card?")) return;
    try {
      const token = localStorage.getItem("token");
      let res = await fetch(`${BASE}/api/jobcards/${job._id || job.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 401) {
        try {
          const t = await fetch(`${BASE}/api/auth/test-token`);
          const tj = await t.json();
          if (t.ok && tj.token) {
            localStorage.setItem('token', tj.token);
          }
        } catch (e) {
          console.warn('Failed to refresh token', e);
        }
        const newToken = localStorage.getItem('token');
        res = await fetch(`${BASE}/api/jobcards/${job._id || job.id}`, {
          method: "DELETE",
          headers: newToken ? { Authorization: `Bearer ${newToken}` } : {},
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Delete failed");
      toast.success("Job card deleted");
      fetchData(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleCreateJobCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form) as any);

    // Map friendly form names to backend fields
    const payload: any = {
      title: data.title,
      vehicle: data.vehicle,
      vehicleMake: data.vehicleMake,
      regNo: data.regNo,
      vin: data.vin,
      odometer: data.odometer ? Number(data.odometer) : undefined,
      customer: data.customerName || data.customer,
      assignedTo: data.advisor || data.assignedTo,
      description: data.concerns || data.description,
      mobile: data.mobile,
      email: data.email,
      advance: data.advance ? Number(data.advance) : undefined,
      insurance: data.insurance,
    };

    try {
      const token = localStorage.getItem("token");
      let res = await fetch(`${BASE}/api/jobcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      // If unauthorized, try to fetch dev token and retry once
      if (res.status === 401) {
        try {
          const t = await fetch(`${BASE}/api/auth/test-token`);
          const tj = await t.json();
          if (t.ok && tj.token) {
            localStorage.setItem('token', tj.token);
          }
        } catch (e) {
          console.warn('Failed to refresh token', e);
        }
        const newToken = localStorage.getItem('token');
        res = await fetch(`${BASE}/api/jobcards`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Create failed");
      toast.success("Job card created successfully!");
      setIsDialogOpen(false);
      // refresh
      fetchData(1);
    } catch (err: any) {
      // Parse validation error message from backend for friendlier display
      const msg = err?.message || "Failed to create";
      const validationPrefix = "Validation failed:";
      if (msg.includes(validationPrefix)) {
        const friendly = msg.replace(validationPrefix, '').trim();
        toast.error(friendly);
      } else {
        toast.error(msg);
      }
    }
  };


  const handleExport = () => {
    toast.success("Exporting job cards data...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Cards</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all workshop job cards</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Job Card
          </Button>
          { (window.location.hostname === 'localhost' || import.meta.env.DEV) && (
            <Button variant="ghost" size="sm" onClick={async () => {
              try {
                const res = await fetch(`${BASE}/api/auth/test-token`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed');
                localStorage.setItem('token', json.token);
                toast.success('Test token set in localStorage');
              } catch (err: any) {
                toast.error(err.message || 'Failed to get test token');
              }
            }}>Set Test Token</Button>
          ) }
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Job Card</DialogTitle>
            <DialogDescription>Enter the details to create a new job card</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateJobCard} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="e.g., AC Repair - John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Vehicle Make</Label>
                <Input id="make" name="vehicleMake" placeholder="e.g., Maruti" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="vehicle" placeholder="e.g., Swift" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regNo">Registration No</Label>
                <Input id="regNo" name="regNo" placeholder="e.g., MH 01 AB 1234" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input id="vin" name="vin" placeholder="Vehicle Identification Number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer Reading</Label>
              <Input id="odometer" name="odometer" type="number" placeholder="e.g., 45000" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" placeholder="Enter name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input id="mobile" name="mobile" type="tel" placeholder="Enter mobile" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concerns">Customer Concerns / Remarks</Label>
              <Textarea id="concerns" name="concerns" placeholder="Describe the issues" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="advisor">Service Advisor</Label>
                <Select name="advisor" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amit Shah">Amit Shah</SelectItem>
                    <SelectItem value="Sneha Patel">Sneha Patel</SelectItem>
                    <SelectItem value="Rahul Mehta">Rahul Mehta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance">Advance Payment</Label>
                <Input id="advance" name="advance" type="number" placeholder="₹ 0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance Details</Label>
              <Input id="insurance" name="insurance" placeholder="Insurance company & policy" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Job Card</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog - opened programmatically */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Card</DialogTitle>
            <DialogDescription>Update the job card details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_title">Job Title</Label>
                <Input id="edit_title" name="title" value={editForm.title || ''} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_make">Vehicle Make</Label>
                <Input id="edit_make" name="vehicleMake" value={editForm.vehicleMake || ''} onChange={(e) => setEditForm((f) => ({ ...f, vehicleMake: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_model">Model</Label>
                <Input id="edit_model" name="model" value={editForm.model || editForm.vehicle || ''} onChange={(e) => setEditForm((f) => ({ ...f, model: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_regNo">Registration No</Label>
                <Input id="edit_regNo" name="regNo" value={editForm.regNo || ''} onChange={(e) => setEditForm((f) => ({ ...f, regNo: e.target.value }))} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_vin">VIN</Label>
                <Input id="edit_vin" name="vin" value={editForm.vin || ''} onChange={(e) => setEditForm((f) => ({ ...f, vin: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_odometer">Odometer</Label>
                <Input id="edit_odometer" name="odometer" type="number" value={editForm.odometer || ''} onChange={(e) => setEditForm((f) => ({ ...f, odometer: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_mobile">Mobile</Label>
                <Input id="edit_mobile" name="mobile" value={editForm.mobile || ''} onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input id="edit_email" name="email" type="email" value={editForm.email || ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_advance">Advance Payment</Label>
                <Input id="edit_advance" name="advance" type="number" value={editForm.advance || ''} onChange={(e) => setEditForm((f) => ({ ...f, advance: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_insurance">Insurance</Label>
                <Input id="edit_insurance" name="insurance" value={editForm.insurance || ''} onChange={(e) => setEditForm((f) => ({ ...f, insurance: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select value={editForm.status || ''} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_concerns">Customer Concerns / Remarks</Label>
              <Textarea id="edit_concerns" name="concerns" value={editForm.concerns || ''} onChange={(e) => setEditForm((f) => ({ ...f, concerns: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_customerName">Customer Name</Label>
                <Input id="edit_customerName" name="customerName" value={editForm.customerName || ''} onChange={(e) => setEditForm((f) => ({ ...f, customerName: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_advisor">Service Advisor</Label>
                <Select value={editForm.advisor || ''} onValueChange={(v) => setEditForm((f) => ({ ...f, advisor: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Amit Shah">Amit Shah</SelectItem>
                    <SelectItem value="Sneha Patel">Sneha Patel</SelectItem>
                    <SelectItem value="Rahul Mehta">Rahul Mehta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setIsEditOpen(false); setEditingJob(null); setEditForm({}); }}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Job No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service Advisor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created At</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {state.rows.map((row) => (
                  <tr key={row._id || row.jobNumber} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{row.jobNumber}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{row.title}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{row.customer}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{row.assignedTo}</td>
                    <td className="py-3 px-4 text-sm">{getStatusBadge(row.status)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Viewing job details") }>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(row)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Printing job card") }>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Total: {state.total}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchData(Math.max(1, state.page - 1))}
                disabled={state.page <= 1}
              >
                Prev
              </Button>
              <div className="px-3 py-2 bg-muted rounded">Page {state.page} / {Math.max(1, Math.ceil(state.total / state.limit))}</div>
              <Button
                variant="outline"
                onClick={() => fetchData(state.page + 1)}
                disabled={state.page >= Math.ceil(state.total / state.limit)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
