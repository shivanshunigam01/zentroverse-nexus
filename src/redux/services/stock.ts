import { baseApi } from "../api/baseApi";

export const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStocks: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/stock?page=${page}&limit=${limit}`, method: 'GET' }),
      providesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    getStockByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addStock: builder.mutation<any, any>({
      query: (body) => ({ url: '/stock', method: 'POST', body }),
      invalidatesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    updateStock: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/stock/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),

    deleteStock: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStocksQuery, useGetStockByIDQuery, useAddStockMutation, useUpdateStockMutation, useDeleteStockMutation } = stockApi;
