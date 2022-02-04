import { pick } from "lodash/fp";
import { MATCH_ANY_PARAMETERS } from "wildcard-mock-link";
import {
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables,
} from "../../../graphql-types/GetAllImagesOfADatasetQuery";
import { GET_ALL_IMAGES_OF_A_DATASET_QUERY } from "../../../hooks/use-images-navigation";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../../utils/tests/apollo-mock";
import {
  DEEP_DATASET_WITH_IMAGES_DATA,
  BASIC_DATASET_DATA,
} from "../../../utils/tests/data.fixtures";

const DATASET_SLUG_DATA = {
  [BASIC_DATASET_DATA.slug]: BASIC_DATASET_DATA,
  [DEEP_DATASET_WITH_IMAGES_DATA.slug]: DEEP_DATASET_WITH_IMAGES_DATA,
};

export const GET_ALL_IMAGES_OF_A_DATASET_MOCK: ApolloMockResponse<
  GetAllImagesOfADatasetQuery,
  GetAllImagesOfADatasetQueryVariables
> = {
  request: {
    query: GET_ALL_IMAGES_OF_A_DATASET_QUERY,
    variables: MATCH_ANY_PARAMETERS,
  },
  result: jest.fn((variables) => ({
    data: {
      dataset:
        variables.slug in DATASET_SLUG_DATA
          ? {
              id: DATASET_SLUG_DATA[variables.slug].id,
              images: DATASET_SLUG_DATA[variables.slug].images.map((image) =>
                pick(["id", "url", "thumbnail200Url"], image)
              ),
            }
          : {
              id: "unknown dataset ID",
              images: [],
            },
    },
  })),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_ALL_IMAGES_OF_A_DATASET_MOCK,
];
