import { baseApi } from "../api/baseApi";
import { stockIssuesApi } from "./stockIssuesSlice";

export const purchaseReturnsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseReturns: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/purchase-returns?page=${page}&limit=${limit}`, method: 'GET' }),

    }),

    getPurchaseReturnByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/purchase-returns/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addPurchaseReturn: builder.mutation<any, any>({
      query: (body) => ({ url: '/purchase-returns', method: 'POST', body }),
      invalidatesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    updatePurchaseReturn: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/purchase-returns/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),

    deletePurchaseReturn: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/purchase-returns/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPurchaseReturnsQuery, useGetPurchaseReturnByIDQuery, useAddPurchaseReturnMutation, useUpdatePurchaseReturnMutation, useDeletePurchaseReturnMutation } = purchaseReturnsApi;