import { baseApi } from "../api/baseApi";
import type {
    JobCard,
    CreateJobCardRequest,
    UpdateJobCardRequest,
    JobCardListResponse,
    JobCardResponse,
    JobCardQueryParams,
} from "@/types/jobCard";

export const jobCardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all job cards
        getAllJobCards: builder.query<JobCardListResponse | JobCard[], JobCardQueryParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.status) queryParams.append("status", params.status);
                    if (params.search) queryParams.append("search", params.search);
                    if (params.page) queryParams.append("page", params.page.toString());
                    if (params.limit) queryParams.append("limit", params.limit.toString());
                    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
                    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
                }
                const queryString = queryParams.toString();
                return `/job-cards${queryString ? `?${queryString}` : ""}`;
            },
            providesTags: (result) => {
                // Handle array response
                if (Array.isArray(result)) {
                    if (result.length === 0) {
                        return [{ type: "JobCard", id: "LIST" }];
                    }
                    return [
                        ...result.map(({ _id }) => ({ type: "JobCard" as const, id: _id })),
                        { type: "JobCard", id: "LIST" },
                    ];
                }
                // Handle object response with jobCards property
                const jobCards = result.jobCards || result.data;
                if (!result || !jobCards || !Array.isArray(jobCards)) {
                    return [{ type: "JobCard", id: "LIST" }];
                }
                return [
                    ...jobCards.map(({ _id }) => ({ type: "JobCard" as const, id: _id })),
                    { type: "JobCard", id: "LIST" },
                ];
            },
        }),

        // Get job card by ID
        getJobCardById: builder.query<JobCardResponse, string>({
            query: (id) => `/job-cards/${id}`,
            providesTags: (_result, _error, id) => [{ type: "JobCard", id }],
        }),

        // Get job card by job card number
        getJobCardByJobCardNo: builder.query<JobCardResponse, string>({
            query: (jobCardNo) => `/job-cards/job-card-no/${jobCardNo}`,
            providesTags: (_result, _error, jobCardNo) => [
                { type: "JobCard", id: jobCardNo },
            ],
        }),

        // Create job card
        createJobCard: builder.mutation<JobCardResponse, CreateJobCardRequest>({
            query: (body) => ({
                url: "/job-cards",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "JobCard", id: "LIST" }],
        }),

        // Update job card
        updateJobCard: builder.mutation<
            JobCardResponse,
            { id: string; data: UpdateJobCardRequest }
        >({
            query: ({ id, data }) => ({
                url: `/job-cards/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "JobCard", id },
                { type: "JobCard", id: "LIST" },
            ],
        }),

        // Delete job card
        deleteJobCard: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (id) => ({
                url: `/job-cards/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "JobCard", id },
                { type: "JobCard", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllJobCardsQuery,
    useGetJobCardByIdQuery,
    useGetJobCardByJobCardNoQuery,
    useCreateJobCardMutation,
    useUpdateJobCardMutation,
    useDeleteJobCardMutation,
} = jobCardApi;

