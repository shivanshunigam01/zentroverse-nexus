import { baseApi } from "../api/baseApi";

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all vendors with pagination
    getVendors: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `/vendors?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [{ type: "vendor", id: "LIST" }],
    }),

    // Get vendor by ID
    getVendorByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/vendors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, arg) => [{ type: "vendor", id: arg.id }],
    }),

    // Create new vendor
    addVendor: builder.mutation<any, any>({
      query: (body) => ({
        url: "/vendors",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "vendor", id: "LIST" }],
    }),

    // Update vendor
    updateVendor: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/vendors/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "vendor", id: arg.id },
        { type: "vendor", id: "LIST" },
      ],
    }),

    // Delete vendor
    deleteVendor: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "vendor", id: arg.id },
        { type: "vendor", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVendorsQuery,
  useGetVendorByIDQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
