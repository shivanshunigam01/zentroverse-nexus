import { baseApi } from "../api/baseApi";
import {
  GetVendorsResponse,
  GetVendorByIdResponse,
  CreateVendorRequest,
  CreateVendorResponse,
  UpdateVendorRequest,
  UpdateVendorResponse,
  DeleteVendorResponse,
  GetVendorsQueryParams,
} from "@/types/vendor";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all vendors with pagination and search
    getVendors: builder.query<GetVendorsResponse, GetVendorsQueryParams>({
      query: ({ page = 1, limit = 20, search = '' } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) {
          params.append('search', search);
        }
        return {
          url: `/vendors?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "vendor", id: "LIST" }],
    }),

    // Get vendor by ID
    getVendorByID: builder.query<GetVendorByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "vendor", id: arg.id }],
    }),

    // Create new vendor
    addVendor: builder.mutation<CreateVendorResponse, CreateVendorRequest>({
      query: (body) => ({
        url: "/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "vendor", id: "LIST" }],
    }),

    // Update vendor
    updateVendor: builder.mutation<
      UpdateVendorResponse,
      { id: string; body: UpdateVendorRequest }
    >({
      query: ({ id, body }) => ({
        url: `/vendors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "vendor", id: "LIST" },
        { type: "vendor", id: arg.id },
      ],
    }),

    // Delete vendor
    deleteVendor: builder.mutation<DeleteVendorResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "vendor", id: arg.id },
        { type: "vendor", id: "LIST" },
      ],
    }),

    // Export vendors to Excel
   exportVendorsExcel: builder.mutation<Blob, { search?: string }>({
      query: () => ({
        url: "/vendors/export/excel",
        method: "GET",
        responseHandler: (response) => response.blob()
      })
    })
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useGetVendorByIDQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
  useExportVendorsExcelMutation,
} = vendorApi;
