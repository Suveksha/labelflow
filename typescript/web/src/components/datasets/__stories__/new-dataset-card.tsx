import { Box } from "@chakra-ui/react";
import { NewDatasetCard } from "..";
import {
  apolloDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/storybook";

export default {
  title: storybookTitle(NewDatasetCard),
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Default = () => {
  return (
    <Box background="gray.100" padding={4} w="sm">
      <NewDatasetCard addDataset={() => {}} disabled={false} />
    </Box>
  );
};
