import React from "react";
import { pick } from "lodash/fp";
import {
  DeleteLabelClassModal,
  DELETE_LABEL_CLASS_MUTATION,
} from "./delete-label-class-modal";
import { GET_LABEL_CLASS_BY_ID_QUERY } from "./dataset-classes.query";
import {
  DatasetClassesContext,
  DatasetClassesState,
} from "./dataset-classes.context";
import { BASIC_LABEL_CLASS_DATA } from "../../utils/tests/data.fixtures";
import {
  ApolloMockResponse,
  ApolloMockResponses,
} from "../../utils/tests/apollo-mock";
import {
  GetLabelClassByIdQuery,
  GetLabelClassByIdQueryVariables,
} from "../../graphql-types/GetLabelClassByIdQuery";
import {
  DeleteLabelClassMutation,
  DeleteLabelClassMutationVariables,
} from "../../graphql-types/DeleteLabelClassMutation";

export type TestComponentProps = {
  setDeleteClassId?: () => void;
  labelClassInfo?: { id: string; datasetId: string };
};

export const TestComponent = ({
  setDeleteClassId = () => {},
  labelClassInfo = {
    id: BASIC_LABEL_CLASS_DATA.id,
    datasetId: BASIC_LABEL_CLASS_DATA.dataset.id,
  },
}: TestComponentProps) => (
  <DatasetClassesContext.Provider
    value={{
      ...({} as DatasetClassesState),
      datasetId: labelClassInfo.datasetId,
      setDeleteClassId,
      deleteClassId: labelClassInfo.id,
    }}
  >
    <DeleteLabelClassModal />
  </DatasetClassesContext.Provider>
);

export const GET_LABEL_CLASS_BY_ID_MOCK: ApolloMockResponse<
  GetLabelClassByIdQuery,
  GetLabelClassByIdQueryVariables
> = {
  request: {
    query: GET_LABEL_CLASS_BY_ID_QUERY,
    variables: {
      id: BASIC_LABEL_CLASS_DATA.id,
    },
  },
  nMatches: Number.POSITIVE_INFINITY,
  result: {
    data: {
      labelClass: {
        ...pick(["id", "name"], BASIC_LABEL_CLASS_DATA),
      },
    },
  },
};

export const DELETE_LABEL_CLASS_SIMPLE_MOCK: ApolloMockResponse<
  DeleteLabelClassMutation,
  DeleteLabelClassMutationVariables
> = {
  request: {
    query: DELETE_LABEL_CLASS_MUTATION,
    variables: { id: BASIC_LABEL_CLASS_DATA.id },
  },
  result: jest.fn(() => {
    return {
      data: {
        deleteLabelClass: {
          __typename: "LabelClass",
          id: BASIC_LABEL_CLASS_DATA.id,
        },
      },
    };
  }),
};

export const APOLLO_MOCKS: ApolloMockResponses = [
  GET_LABEL_CLASS_BY_ID_MOCK,
  DELETE_LABEL_CLASS_SIMPLE_MOCK,
];
