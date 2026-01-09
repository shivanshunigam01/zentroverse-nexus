import { baseApi } from "../api/baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<any, { page?: number; limit?: number ,type:'individual' | 'corporate'}>({
      query: ({ page = 1, limit = 20 ,type = 'individual'}) => ({ url: `/customers/${type}?page=${page}&limit=${limit}`, method: 'GET' }),
       providesTags:[{ type: 'customer', id: 'LIST' }]
    }),

    getCustomerByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/customers/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'customer', id: arg.id }],
    }),

    addCustomer: builder.mutation<any, any>({
      query: (body) => ({ url: '/customers', method: 'POST', body }),
      invalidatesTags: [{ type: 'customer', id: 'LIST' }],
    }),

    updateCustomer: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/customers/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'customer', id: 'LIST' }],
    }),

    deleteCustomer: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/customers/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'customer', id: 'LIST' }],
    }),
    updateStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/customers/${id}/${status}`, method: 'PATCH' }),
      invalidatesTags: [{ type: 'customer', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCustomersQuery, useGetCustomerByIDQuery, useAddCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, useUpdateStatusMutation } = customerApi;
