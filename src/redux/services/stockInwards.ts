import { baseApi } from "../api/baseApi";

export const stockInwardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockInwards: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/stock-inwards?page=${page}&limit=${limit}`, method: 'GET' }),
     providesTags: [{ type: 'inwards', id: 'LIST' }],
    }),

    getStockInwardByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-inwards/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'inwards', id: arg.id }],
    }),

    addStockInward: builder.mutation<any, any>({
      query: (body) => ({ url: '/stock-inwards', method: 'POST', body }),
      invalidatesTags: [{ type: 'inwards', id: 'LIST' }],
    }),

    updateStockInward: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/stock-inwards/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'inwards', id: arg.id }, { type: 'inwards', id: 'LIST' }],
    }),

    deleteStockInward: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-inwards/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'inwards', id: arg.id }, { type: 'inwards', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStockInwardsQuery, useGetStockInwardByIDQuery, useAddStockInwardMutation, useUpdateStockInwardMutation, useDeleteStockInwardMutation } = stockInwardApi;
