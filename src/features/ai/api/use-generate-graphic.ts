import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { useMutation } from "@tanstack/react-query";

type ResponseType = InferResponseType<typeof client.api.ai["generate-graphic"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.ai["generate-graphic"]["$post"]>["json"];

export const useGenerateGraphic = () => {
  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.ai["generate-graphic"].$post({ json });
      if (!response.ok) {
        throw new Error('Failed to generate graphic');
      }
      return await response.json();
    },
  });

  return mutation;
};