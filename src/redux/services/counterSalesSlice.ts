import { baseApi } from "../api/baseApi";

export const counterSalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCounterSales: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/counter-sales?page=${page}&limit=${limit}`, method: 'GET' }),

    }),

    getCounterSaleByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addCounterSale: builder.mutation<any, any>({
      query: (body) => ({ url: '/counter-sales', method: 'POST', body }),
      invalidatesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    updateCounterSale: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/counter-sales/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),

    deleteCounterSale: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCounterSalesQuery, useGetCounterSaleByIDQuery, useAddCounterSaleMutation, useUpdateCounterSaleMutation, useDeleteCounterSaleMutation } = counterSalesApi;
