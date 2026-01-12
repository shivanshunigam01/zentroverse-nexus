/**
 * Vendor Module Types
 * Defines TypeScript interfaces for vendor-related data structures
 */

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  data?: {
    message?: string;
  };
}

/**
 * Individual Vendor data structure
 * Maps to MongoDB vendor document
 */
export interface Vendor {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  creditDays: number;
  region: string;
  gstin: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Vendor response from single vendor GET endpoint
 * GET /vendors/:id
 */
export interface GetVendorByIdResponse {
  success: boolean;
  vendor: Vendor;
  message: string;
}

/**
 * Paginated vendors list response
 * GET /vendors?page=1&limit=20
 */
export interface GetVendorsResponse {
  success: boolean;
  total: number;
  page: number;
  limit: number;
  vendors: Vendor[];
}

/**
 * Request payload for creating a new vendor
 * POST /vendors
 */
export interface CreateVendorRequest {
  name: string;
  email: string;
  contactNumber: string;
  creditDays: number;
  region: string;
  gstin: string;
}

/**
 * Response from create vendor endpoint
 * POST /vendors
 */
export interface CreateVendorResponse {
  success: boolean;
  vendor: Vendor;
  message: string;
}

/**
 * Request payload for updating vendor
 * PUT /vendors/:id
 */
export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  contactNumber?: string;
  creditDays?: number;
  region?: string;
  gstin?: string;
}

/**
 * Response from update vendor endpoint
 * PUT /vendors/:id
 */
export interface UpdateVendorResponse {
  success: boolean;
  vendor: Vendor;
  message: string;
}

/**
 * Response from delete vendor endpoint
 * DELETE /vendors/:id
 */
export interface DeleteVendorResponse {
  success: boolean;
  message: string;
}

/**
 * Query parameters for vendors list with search support
 * GET /vendors?page=1&limit=20&search=term
 */
export interface GetVendorsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Form submission payload for add/edit vendor
 * Extends CreateVendorRequest with optional id for updates
 */
export interface VendorFormPayload extends CreateVendorRequest {
  id?: string;
}
