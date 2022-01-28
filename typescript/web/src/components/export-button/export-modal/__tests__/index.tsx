/* eslint-disable import/first */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import { incrementMockedDate } from "@labelflow/dev-utils/mockdate";
import { processImage } from "../../../../connectors/repository/image-processing";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter({
  query: { datasetSlug: "test-dataset", workspaceSlug: "local" },
});

import { ExportModal } from "..";
import { theme } from "../../../../theme";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import {
  CREATE_TEST_DATASET_MUTATION,
  CREATE_TEST_IMAGE_MUTATION,
} from "../../../../utils/tests/mutations";
import { CREATE_LABEL_MUTATION } from "../../../../connectors/undo-store/effects/shared-queries";
import { LabelCreateInput } from "../../../../graphql-types/globalTypes";

setupTestsWithLocalDatabase();

jest.mock("../../../../connectors/repository/image-processing");
const mockedProcessImage = processImage as jest.Mock;

const wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>
    <ChakraProvider theme={theme} resetCSS>
      {children}
    </ChakraProvider>
  </ApolloProvider>
);

const createDataset = async (
  datasetId = "mocked-dataset-id",
  name = "test dataset"
) => {
  return await client.mutate({
    mutation: CREATE_TEST_DATASET_MUTATION,
    variables: { datasetId, name, workspaceSlug: "local" },
  });
};

const labelData = {
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
  },
};

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
    mutation: CREATE_LABEL_MUTATION,
    variables: {
      data,
    },
  });
};

const imageWidth = 500;
const imageHeight = 900;

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: CREATE_TEST_IMAGE_MUTATION,
    variables: {
      name,
      file: new Blob(),
      width: imageWidth,
      height: imageHeight,
      datasetId: "mocked-dataset-id",
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

test("File should be downloaded when user clicks on Export to COCO and Export", async () => {
  await createDataset();
  render(<ExportModal isOpen onClose={() => {}} />, { wrapper });
  const anchorMocked = {
    href: "",
    click: jest.fn(),
  } as any;
  const createElementOriginal = document.createElement.bind(document);
  jest.spyOn(document, "createElement").mockImplementation((name, options) => {
    if (name === "a") {
      return anchorMocked;
    }
    return createElementOriginal(name, options);
  });

  await waitFor(() => {
    userEvent.click(screen.getByText("Export to COCO"));
    expect(screen.getByText("Export Options")).toBeDefined();
  });
  userEvent.click(screen.getByRole("button", { name: "Export" }));

  await waitFor(() => expect(anchorMocked.click).toHaveBeenCalledTimes(1));
}, 20000);

test("Export Modal should display the number of labels", async () => {
  await createDataset();
  await createDataset("second-dataset-id", "second-test-dataset");
  mockedProcessImage.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const imageId = await createImage("an image");
  await createLabel({
    ...labelData,
    imageId,
  });
  incrementMockedDate(1);
  await createLabel({
    ...labelData,
    imageId,
  });

  render(<ExportModal isOpen onClose={() => {}} />, { wrapper });

  await waitFor(() =>
    expect(screen.getByRole("banner").textContent).toEqual(
      expect.stringContaining("1 images and 2 labels")
    )
  );
});
