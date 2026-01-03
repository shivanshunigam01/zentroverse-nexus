import { baseApi } from "../api/baseApi";

export const counterSalesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // fetch parts / stock
    getStock: builder.query<any[], void>({
      query: () => ({ url: '/stock', method: 'GET' }),
      providesTags: ['stock'],
    }),

    // list counter-sales
    getCounterSales: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: `/counter-sales?page=${page}&limit=${limit}`,
        method: 'GET',
        providesTags: ['counterSales'],
      }),
    }),

    // create counter-sale
    createCounterSale: builder.mutation<any, any>({
      query: (body) => ({ url: '/counter-sales', method: 'POST', body }),
      invalidatesTags: ['counterSales', 'stock'],
    }),

    // delete counter-sale
    deleteCounterSale: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }],
    }),

    // update sale (draft only)
    updateCounterSale: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/counter-sales/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }],
    }),

    // complete sale (deduct stock)
    completeCounterSale: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}/complete`, method: 'PATCH' }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }, { type: 'stock', id: 'LIST' }],
    }),

    // cancel sale (restore stock)
    cancelCounterSale: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }, { type: 'stock', id: 'LIST' }],
    }),

    // refund sale (restore stock)
    refundCounterSale: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}/refund`, method: 'PATCH' }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }, { type: 'stock', id: 'LIST' }],
    }),

    // add payment to sale
    addPayment: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/counter-sales/${id}/payment`, method: 'POST', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'counterSales', id: arg.id }, { type: 'counterSales', id: 'LIST' }],
    }),

    // get invoice
    getInvoice: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/counter-sales/${id}/invoice`, method: 'GET' }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStockQuery,
  useGetCounterSalesQuery,
  useCreateCounterSaleMutation,
  useDeleteCounterSaleMutation,
  useUpdateCounterSaleMutation,
  useCompleteCounterSaleMutation,
  useCancelCounterSaleMutation,
  useRefundCounterSaleMutation,
  useAddPaymentMutation,
  useGetInvoiceQuery,
} = counterSalesApi;
