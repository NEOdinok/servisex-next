import { GetProductsResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_TAG } from "./tags";

export const clientApi = createApi({
  reducerPath: "api",
  tagTypes: [BASE_TAG],
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getProductsByIds: builder.query<GetProductsResponse, string[]>({
      query: (ids) => `getProductsByIds?ids=${ids.join(",")}`,
    }),
  }),
});

export const { useGetProductsByIdsQuery } = clientApi;
