import {
  Dataset,
  LabelClass,
  LabelsAggregates,
  Workspace,
  Image,
  Label,
} from "@labelflow/graphql-types";
import { LabelType } from "../../graphql-types/globalTypes";

export type WorkspaceData = Pick<Workspace, "slug">;

export type DatasetData = Pick<Dataset, "id" | "name" | "slug"> & {
  labelClasses: Omit<LabelClassData, "dataset">[];
  workspace: WorkspaceData;
};

export type ImageData = Pick<Image, "id" | "name" | "url"> & {
  dataset: DatasetData;
};

export type LabelClassData = Pick<
  LabelClass,
  "id" | "index" | "name" | "color"
> & {
  shortcut: string;
  dataset: DatasetData;
  labelsAggregates: LabelsAggregates;
};

export type LabelData = Pick<Label, "id" | "type" | "imageId"> & {
  labelClass: LabelClassData;
};

export const BASIC_WORKSPACE_DATA: WorkspaceData = {
  slug: "my-test-workspace",
};

export const BASIC_DATASET_DATA: DatasetData = {
  id: "8f47e891-3b24-427a-8db0-dab362fbe269",
  name: "My Test Dataset",
  slug: "my-test-dataset",
  workspace: BASIC_WORKSPACE_DATA,
  labelClasses: [],
};

export const DEEP_DATASET_WITH_CLASSES_DATA: DatasetData = {
  id: "2f062478-aa66-4c77-be1a-bfbca1668695",
  name: "My Test Dataset With Classes",
  slug: "my-test-dataset-with-classes",
  workspace: BASIC_WORKSPACE_DATA,
  labelClasses: [
    {
      id: "cc4051a6-6ef3-49c2-92fa-f5b0eadb8934",
      index: 0,
      shortcut: "0",
      name: "My Test Class 1",
      color: "#F87171",
      labelsAggregates: {
        totalCount: 10,
      },
    },
    {
      id: "534ead9b-174c-4fa9-afd9-5f5d0b203355",
      index: 1,
      shortcut: "1",
      name: "My Test Class 2",
      color: "#FACC15",
      labelsAggregates: {
        totalCount: 12,
      },
    },
    {
      id: "73a020aa-dd5e-4d6f-985a-f43d9f2744d5",
      index: 2,
      shortcut: "2",
      name: "My Test Class 3 has a very long name that is way larger than anyone would ever expect for a such a field with words that do not exist with many letters such as the following one which is very loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong",
      color: "#34D399",
      labelsAggregates: {
        totalCount: 5,
      },
    },
  ],
};

export const BASIC_IMAGE_DATA: ImageData = {
  id: "cae07de6-8054-11ec-9c81-fb4047302868",
  name: "My Test Image",
  url: "https://localhost:3000/api/downloads/8f47e891-3b24-427a-8db0-dab362fbe269/cae07de6-8054-11ec-9c81-fb4047302868",
  dataset: BASIC_DATASET_DATA,
};

export const BASIC_LABEL_CLASS_DATA: LabelClassData = {
  ...DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[0],
  dataset: DEEP_DATASET_WITH_CLASSES_DATA,
};

export const BASIC_LABEL_DATA: LabelData = {
  id: "87a60aa2-8057-11ec-80be-5f791a5254d5",
  type: LabelType.Box,
  labelClass: BASIC_LABEL_CLASS_DATA,
  imageId: BASIC_IMAGE_DATA.id,
};
