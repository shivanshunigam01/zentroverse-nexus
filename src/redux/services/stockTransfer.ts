import { baseApi } from "../api/baseApi";

export const stockAlertsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockTransfers: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/stock-transfers?page=${page}&limit=${limit}`, method: 'GET' }),
       providesTags:[{ type: 'stocktransfer', id: 'LIST' }]
    }),

    getStockTransferByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-transfers/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stocktransfer', id: arg.id }],
    }),

    addStockTransfer: builder.mutation<any, any>({
      query: (body) => ({ url: '/stock-transfers', method: 'POST', body }),
      invalidatesTags: [{ type: 'stocktransfer', id: 'LIST' }],
    }),

    updateStockTransfer: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/stock-transfers/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'stocktransfer', id: 'LIST' }],
    }),

    deleteStockTransfer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-transfers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'stocktransfer', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStockTransfersQuery, useGetStockTransferByIDQuery, useAddStockTransferMutation, useUpdateStockTransferMutation, useDeleteStockTransferMutation } = stockAlertsApi;
