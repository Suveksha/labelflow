/* eslint-disable import/first */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WildcardMockLink } from "wildcard-mock-link";
import { mockNextRouter } from "../../../../utils/router-mocks";
import {
  BASIC_LABEL_DATA,
  DEEP_DATASET_WITH_CLASSES_DATA,
} from "../../../../utils/tests/data.fixtures";

mockNextRouter({
  query: {
    imageId: BASIC_LABEL_DATA.imageId,
    datasetSlug: BASIC_LABEL_DATA.labelClass.dataset.slug,
    workspaceSlug: BASIC_LABEL_DATA.labelClass.dataset.workspace.slug,
  },
});

import { useLabelingStore, Tools } from "../../../../connectors/labeling-state";
import {
  getApolloMockLink,
  getApolloMockWrapper,
} from "../../../../utils/tests/apollo-mock";
import { EditLabelClass } from "../edit-label-class";
import {
  APOLLO_MOCKS,
  CREATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_ACTION_MOCK,
  UPDATE_LABEL_CLASS_OF_LABEL_MOCK,
} from "../../edit-label-class.fixtures";

const onCloseEditLabelClass = jest.fn();

const renderEditLabelClass = (mockLink: WildcardMockLink) => {
  return render(<EditLabelClass isOpen onClose={onCloseEditLabelClass} />, {
    wrapper: getApolloMockWrapper(mockLink),
  });
};

beforeEach(async () => {
  act(() =>
    useLabelingStore.setState({
      selectedLabelId: BASIC_LABEL_DATA.id,
      selectedTool: Tools.SELECTION,
    })
  );

  jest.clearAllMocks();
});

it("should create a class", async () => {
  const mockLink = getApolloMockLink(APOLLO_MOCKS);
  renderEditLabelClass(mockLink);
  act(() =>
    userEvent.type(screen.getByPlaceholderText(/Search/), "newClassTest")
  );
  await waitFor(() => expect(screen.getByText("Create class")).toBeDefined());
  userEvent.click(screen.getByText("Create class"));
  await act(() => mockLink.waitForAllResponsesRecursively());
  expect(CREATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
  expect(UPDATE_LABEL_CLASS_ACTION_MOCK.result).toHaveBeenCalled();
});

it("should change a class", async () => {
  const mockLink = getApolloMockLink(APOLLO_MOCKS);
  renderEditLabelClass(mockLink);
  await waitFor(() =>
    expect(
      screen.getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
    ).toBeDefined()
  );
  userEvent.click(
    screen.getByText(DEEP_DATASET_WITH_CLASSES_DATA.labelClasses[1].name)
  );
  // Intentionally done twice
  await act(() => mockLink.waitForAllResponses());
  await act(() => mockLink.waitForAllResponses());
  expect(UPDATE_LABEL_CLASS_OF_LABEL_MOCK.result).toHaveBeenCalled();
});
