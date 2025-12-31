import { baseApi } from "../api/baseApi";

export const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrder: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/purchase-orders?page=${page}&limit=${limit}`, method: 'GET' }),

    }),

    getPurchaseOrderByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/purchase-orders/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addPurchaseOrder: builder.mutation<any, any>({
      query: (body) => ({ url: '/purchase-orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    updatePurchaseOrder: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/purchase-orders/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),

    deletePurchaseOrder: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/purchase-orders/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPurchaseOrderQuery, useGetPurchaseOrderByIDQuery, useAddPurchaseOrderMutation, useUpdatePurchaseOrderMutation, useDeletePurchaseOrderMutation } = purchaseApi;
