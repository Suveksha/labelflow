import { pick } from "lodash/fp";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables,
} from "../../../graphql-types/GetImageLabelsQuery";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import { DEEP_DATASET_WITH_LABELS_DATA } from "../../../utils/tests/data.fixtures";
import { GET_IMAGE_LABELS_QUERY } from "./queries";

export const GET_IMAGE_LABELS_MOCK: ApolloMockResponse<
  GetImageLabelsQuery,
  GetImageLabelsQueryVariables
> = {
  request: {
    query: GET_IMAGE_LABELS_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: jest.fn((variables) => {
    const imageData = DEEP_DATASET_WITH_LABELS_DATA.images.find(
      (image) => image.id === variables.imageId
    );
    if (imageData === undefined)
      throw new Error("unexpected mock query variables");
    return {
      data: {
        image: {
          ...pick(["id", "width", "height"], imageData),
          labels: imageData.labels.map((labelData) => ({
            ...pick(
              [
                "type",
                "id",
                "x",
                "y",
                "width",
                "height",
                "smartToolInput",
                "geometry",
              ],
              labelData
            ),
            labelClass: {
              ...pick(["id", "name", "color"], labelData.labelClass),
            },
          })),
        },
      },
    };
  }),
};

export const APOLLO_MOCKS: ApolloMockResponses = [GET_IMAGE_LABELS_MOCK];
