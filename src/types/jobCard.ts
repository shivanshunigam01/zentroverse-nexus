export interface JobCard {
  _id: string;
  jobNumber: string;
  title: string;
  description?: string;
  customer: string;
  email?: string;
  mobile: string;
  vehicle: string;
  vehicleMake?: string;
  regNo: string;
  vin?: string;
  odometer?: number;
  status: "pending" | "in_progress" | "invoice" | "delivered" | "cancelled" | "Pending" | "In Progress" | "Invoice" | "Delivered" | "Cancelled";
  advance?: number;
  insurance?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  // Legacy fields for backward compatibility
  jobCardNo?: string;
  customerName?: string;
  mobileNo?: string;
  arrivalDate?: string;
  arrivalTime?: string;
  rfeNo?: string;
  invoiceNo?: string;
  serviceType?: string;
  notes?: string;
}

export interface CreateJobCardRequest {
  rfeNo?: string;
  jobCardNo?: string; // Optional - backend will auto-generate if not provided
  regNo: string;
  invoiceNo?: string;
  serviceType?: string;
  vehicle: string;
  status?: "Pending" | "In Progress" | "Invoice" | "Delivered" | "Cancelled";
  customerName: string;
  mobileNo: string;
  arrivalDate: string;
  arrivalTime: string;
  notes?: string;
}

export interface UpdateJobCardRequest extends Partial<CreateJobCardRequest> { }

export interface JobCardListResponse {
  success?: boolean;
  jobCards?: JobCard[];
  data?: JobCard[]; // Keep for backward compatibility
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API might return array directly
export type JobCardListResponseOrArray = JobCardListResponse | JobCard[];

export interface JobCardResponse {
  success: boolean;
  data: JobCard;
  message?: string;
}

export interface JobCardQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

