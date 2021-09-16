import React, { forwardRef } from "react";
import { HStack, Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

import { Label, LabelType } from "@labelflow/graphql-types";

import { useLabellingStore } from "../../../../connectors/labelling-state";

import { noneClassColor } from "../../../../utils/class-color-generator";

const getImageLabelsQuery = gql`
  query getImageLabels($imageId: ID!) {
    image(where: { id: $imageId }) {
      id
      labels {
        type
        id
        x
        y
        width
        height
        labelClass {
          id
          name
          color
        }
        geometry {
          type
          coordinates
        }
      }
    }
  }
`;

export const ClassificationContent = forwardRef<HTMLDivElement>(
  (props, ref) => {
    const { imageId } = useRouter()?.query;
    const { data } = useQuery(getImageLabelsQuery, {
      skip: !imageId,
      variables: { imageId: imageId as string },
    });
    const selectedLabelId = useLabellingStore((state) => state.selectedLabelId);
    const labels = data?.image?.labels ?? [];
    const setSelectedLabelId = useLabellingStore(
      (state) => state.setSelectedLabelId
    );

    return (
      <Box
        overflow="visible"
        w="0"
        h="0"
        m="0"
        p="0"
        display="inline"
        cursor="pointer"
      >
        <HStack
          ref={ref}
          spacing={2}
          padding={2}
          // pl={0}
        >
          {labels
            .filter(
              ({ type }: Label) =>
                type === LabelType.Polygon || type === LabelType.Classification
            )
            .map(({ id, labelClass }: Label) => {
              return (
                <Tag
                  key={id}
                  size="md"
                  variant="solid"
                  background={`${labelClass?.color ?? noneClassColor}AA`}
                  borderColor={
                    id === selectedLabelId
                      ? labelClass?.color ?? noneClassColor
                      : "transparent"
                  }
                  color={labelClass ? "white" : "black"}
                  borderStyle="solid"
                  borderWidth={4}
                  onClick={() => setSelectedLabelId(id)}
                  cursor="pointer"
                  boxSizing="content-box"
                >
                  <TagLabel>{labelClass?.name ?? "None"}</TagLabel>
                  <TagCloseButton />
                </Tag>
              );
            })}
        </HStack>
      </Box>
    );
  }
);
