import { baseApi } from "./baseApi";

export interface EstimateItem {
  part: string;
  labour: string;
  qty: number;
  rate: number;
  labourCost: number;
  tax: number;
  lineTotal?: number;
}

export interface Estimate {
  _id: string;
  estimateId: string;
  jobNo: string;
  customerName: string;
  vehicleDetails: string;
  registrationNo?: string;
  date: string;
  status: "requested" | "approved" | "pending";
  items: EstimateItem[];
  grandTotal: number;
  notes?: string;
}

export interface CreateEstimatePayload {
  customerName: string;
  vehicleDetails: string;
  registrationNo?: string;
  date?: string;
  status?: "requested" | "approved" | "pending";
  items: EstimateItem[];
  notes?: string;
}

export const estimationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEstimates: builder.query<
      Estimate[],
      { status?: "requested" | "approved" | "pending" } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args && args.status) {
          params.set("status", args.status);
        }
        const queryString = params.toString();
        return `/estimates${queryString ? `?${queryString}` : ""}`;
      },
      transformResponse: (response: { success: boolean; data: Estimate[] }) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((est) => ({ type: "Estimate" as const, id: est._id })),
              { type: "Estimate" as const, id: "LIST" },
            ]
          : [{ type: "Estimate" as const, id: "LIST" }],
    }),

    getEstimateById: builder.query<Estimate, string>({
      query: (id) => `/estimates/${id}`,
      transformResponse: (response: { success: boolean; data: Estimate }) =>
        response.data,
      providesTags: (_result, _error, id) => [
        { type: "Estimate", id },
      ],
    }),

    createEstimate: builder.mutation<Estimate, CreateEstimatePayload>({
      query: (body) => ({
        url: "/estimates",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; data: Estimate }) =>
        response.data,
      invalidatesTags: [{ type: "Estimate", id: "LIST" }],
    }),

    updateEstimate: builder.mutation<
      Estimate,
      { id: string; data: Partial<CreateEstimatePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/estimates/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: Estimate }) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Estimate", id },
        { type: "Estimate", id: "LIST" },
      ],
    }),

    updateEstimateStatus: builder.mutation<
      Estimate,
      { id: string; status: "requested" | "approved" | "pending" }
    >({
      query: ({ id, status }) => ({
        url: `/estimates/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: { success: boolean; data: Estimate }) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Estimate", id },
        { type: "Estimate", id: "LIST" },
      ],
    }),

    deleteEstimate: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/estimates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Estimate", id },
        { type: "Estimate", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetEstimatesQuery,
  useGetEstimateByIdQuery,
  useCreateEstimateMutation,
  useUpdateEstimateMutation,
  useUpdateEstimateStatusMutation,
  useDeleteEstimateMutation,
} = estimationApi;


