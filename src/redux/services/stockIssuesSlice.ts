import { baseApi } from "../api/baseApi";

export const stockIssuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStockIssues: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({ url: `/stock-issues?page=${page}&limit=${limit}`, method: 'GET' }),

    }),

    getStockIssueByID: builder.query<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-issues/${id}`, method: 'GET' }),
      providesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }],
    }),

    addStockIssue: builder.mutation<any, any>({
      query: (body) => ({ url: '/stock-issues', method: 'POST', body }),
      invalidatesTags: [{ type: 'stock', id: 'LIST' }],
    }),

    updateStockIssue: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `/stock-issues/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),

    deleteStockIssue: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({ url: `/stock-issues/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'stock', id: arg.id }, { type: 'stock', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetStockIssuesQuery, useGetStockIssueByIDQuery, useAddStockIssueMutation, useUpdateStockIssueMutation, useDeleteStockIssueMutation } = stockIssuesApi;
