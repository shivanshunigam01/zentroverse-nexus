import { baseApi } from "../api/baseApi";
import { stockIssuesApi } from "./stockIssuesSlice";

export const stockAlertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockAlerts: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/stock-alerts?page=${page}&limit=${limit}`, method: 'GET' }),
       providesTags:[{ type: 'stockalert', id: 'LIST' }]
    }),

    getStockAlertByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-alerts/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addStockAlert: builder.mutation<any, any>({
      query: (body) => ({ url: '/stock-alerts', method: 'POST', body }),
      invalidatesTags: [{ type: 'stockalert', id: 'LIST' }],
    }),

    updateStockAlert: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/stock-alerts/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'stockalert', id: 'LIST' }],
    }),

    deleteStockAlert: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-alerts/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'stockalert', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStockAlertsQuery, useGetStockAlertByIDQuery, useAddStockAlertMutation, useUpdateStockAlertMutation, useDeleteStockAlertMutation } = stockAlertsApi;
