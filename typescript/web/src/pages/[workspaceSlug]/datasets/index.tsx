import { gql } from "@apollo/client";
import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useQueryParam } from "use-query-params";
import { AuthManager } from "../../../components/auth-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { DatasetList, NewDatasetCard } from "../../../components/datasets";
import { DeleteDatasetModal } from "../../../components/datasets/delete-dataset-modal";
import { UpsertDatasetModal } from "../../../components/datasets/upsert-dataset-modal";
import { Layout } from "../../../components/layout";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Meta } from "../../../components/meta";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";
import { BoolParam, IdParam } from "../../../utils/query-param-bool";

export const getDatasetsQuery = gql`
  query getDatasets($where: DatasetWhereInput) {
    datasets(where: $where) {
      id
      name
      slug
      images(first: 1) {
        id
        url
        thumbnail500Url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const DatasetPage = () => {
  const {
    query: { workspaceSlug },
    isReady,
  } = useRouter();

  const [isCreatingDataset, setIsCreatingDataset] = useQueryParam(
    "modal-create-dataset",
    BoolParam
  );
  const [editDatasetId, setEditDatasetId] = useQueryParam(
    "modal-edit-dataset",
    IdParam
  );
  const [deleteDatasetId, setDeleteDatasetId] = useQueryParam(
    "alert-delete-dataset",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editDatasetId) {
      setEditDatasetId(null, "replaceIn");
    }

    if (isCreatingDataset) {
      setIsCreatingDataset(false, "replaceIn");
    }

    if (deleteDatasetId) {
      setDeleteDatasetId(null, "replaceIn");
    }
  }, [
    editDatasetId,
    isCreatingDataset,
    deleteDatasetId,
    setEditDatasetId,
    setIsCreatingDataset,
    setDeleteDatasetId,
  ]);

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Datasets" />
      <CookieBanner />
      <Layout
        tabBar={
          <WorkspaceTabBar
            currentTab="datasets"
            workspaceSlug={workspaceSlug as string}
          />
        }
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Datasets</Text>,
        ]}
      >
        <UpsertDatasetModal
          isOpen={isCreatingDataset || editDatasetId != null}
          onClose={onClose}
          datasetId={editDatasetId}
        />

        <DeleteDatasetModal
          isOpen={deleteDatasetId != null}
          onClose={onClose}
          datasetId={deleteDatasetId}
          workspaceSlug={workspaceSlug as string}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewDatasetCard
            disabled={!isReady}
            addDataset={() => {
              setIsCreatingDataset(true, "replaceIn");
            }}
          />
          <DatasetList
            workspaceSlug={workspaceSlug}
            setDeleteDatasetId={setDeleteDatasetId}
            setEditDatasetId={setEditDatasetId}
          />
        </Flex>
      </Layout>
    </>
  );
};

export default DatasetPage;
