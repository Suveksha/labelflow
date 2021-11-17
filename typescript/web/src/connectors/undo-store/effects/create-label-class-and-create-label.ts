import { gql, ApolloClient } from "@apollo/client";

import { GeoJSONPolygon } from "ol/format/GeoJSON";
import { LabelType } from "@labelflow/graphql-types";
import { v4 as uuid } from "uuid";
import { useLabelingStore } from "../../labeling-state";

import { Effect } from "..";

import { addLabelToImageInCache } from "./cache-updates/add-label-to-image-in-cache";
import { removeLabelFromImageCache } from "./cache-updates/remove-label-from-image-cache";
import { createLabelClassMutationUpdate } from "./cache-updates/create-label-class-mutation-update";
import { deleteLabelClassMutationUpdate } from "./cache-updates/delete-label-class-mutation-update";

const createLabelClassQuery = gql`
  mutation createLabelClass($data: LabelClassCreateInput!) {
    createLabelClass(data: $data) {
      id
      name
      color
    }
  }
`;

const deleteLabelClassQuery = gql`
  mutation deleteLabelClass($where: LabelClassWhereUniqueInput!) {
    deleteLabelClass(where: $where) {
      id
    }
  }
`;

const createLabelMutation = gql`
  mutation createLabel(
    $id: ID
    $imageId: ID!
    $labelType: LabelType!
    $labelClassId: ID
    $geometry: GeometryInput!
  ) {
    createLabel(
      data: {
        id: $id
        type: $labelType
        imageId: $imageId
        labelClassId: $labelClassId
        geometry: $geometry
      }
    ) {
      id
      name
      color
    }
  }
`;

const deleteLabelMutation = gql`
  mutation deleteLabel($id: ID!) {
    deleteLabel(where: { id: $id }) {
      id
    }
  }
`;

export const createCreateLabelClassAndCreateLabelEffect = (
  {
    name,
    color,
    datasetId,
    imageId,
    previouslySelectedLabelClassId,
    geometry,
    labelType,
  }: {
    name: string;
    color: string;
    datasetId: string;
    imageId: string;
    previouslySelectedLabelClassId: string | null;
    geometry: GeoJSONPolygon;
    labelType: LabelType;
  },
  {
    setSelectedLabelId,
    client,
  }: {
    setSelectedLabelId: (labelId: string | null) => void;
    client: ApolloClient<object>;
  }
): Effect => ({
  do: async () => {
    const labelClassId = uuid();

    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, datasetId, id: labelClassId } },
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
      update: createLabelClassMutationUpdate(datasetId),
    });

    const createLabelInputs = {
      imageId,
      labelClassId,
      geometry,
      labelType,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      // refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache, { data: mutationPayloadData }) {
        const id = mutationPayloadData?.createLabel?.id;
        if (typeof id !== "string") {
          return;
        }

        addLabelToImageInCache(cache, { ...createLabelInputs, id });
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);

    return {
      id: data.createLabel.id,
      labelClassId,
      labelClassIdPrevious: previouslySelectedLabelClassId,
    };
  },
  undo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: deleteLabelMutation,
      variables: { id },
      // TODO: handle count update
      // refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: { deleteLabel: { id, __typename: "Label" } },
      update(cache) {
        removeLabelFromImageCache(cache, { imageId, id });
      },
    });

    setSelectedLabelId(null);

    await client.mutate({
      mutation: deleteLabelClassQuery,
      variables: {
        where: { id: labelClassId },
      },
      optimisticResponse: {
        deleteLabelClass: { __typename: "LabelClass", id: labelClassId },
      },
      update: deleteLabelClassMutationUpdate(datasetId),
    });

    useLabelingStore.setState({ selectedLabelClassId: labelClassIdPrevious });
    return {
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
  redo: async ({
    id,
    labelClassId,
    labelClassIdPrevious,
  }: {
    id: string;
    labelClassId: string;
    labelClassIdPrevious: string;
  }) => {
    await client.mutate({
      mutation: createLabelClassQuery,
      variables: { data: { name, color, id: labelClassId, datasetId } },
      update: createLabelClassMutationUpdate(datasetId),
      optimisticResponse: {
        createLabelClass: {
          id: labelClassId,
          name,
          color,
          __typename: "LabelClass",
        },
      },
    });

    const createLabelInputs = {
      id,
      imageId,
      labelClassId,
      geometry,
      labelType,
    };
    const { data } = await client.mutate({
      mutation: createLabelMutation,
      variables: createLabelInputs,
      // refetchQueries: ["countLabels", "getDatasets", "countLabelsOfDataset"],
      optimisticResponse: {
        createLabel: { id: `temp-${Date.now()}`, __typename: "Label" },
      },
      update(cache) {
        addLabelToImageInCache(cache, createLabelInputs);
      },
    });

    if (typeof data?.createLabel?.id !== "string") {
      throw new Error("Couldn't get the id of the newly created label");
    }

    setSelectedLabelId(data.createLabel.id);
    return {
      id,
      labelClassId,
      labelClassIdPrevious,
    };
  },
});
