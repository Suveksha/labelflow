import { gql, useQuery } from "@apollo/client";
import { BreadcrumbLink, Center, Skeleton, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import React from "react";
import { resetServerContext } from "react-beautiful-dnd";
import { useErrorHandler } from "react-error-boundary";
import { AuthManager } from "../../../../../components/auth-manager";
import { CookieBanner } from "../../../../../components/cookie-banner";
import { DatasetClasses } from "../../../../../components/dataset-classes";
import { ExportButton } from "../../../../../components/export-button";
import { ImportButton } from "../../../../../components/import-button";
import { Layout } from "../../../../../components/layout";
import { DatasetTabBar } from "../../../../../components/layout/tab-bar/dataset-tab-bar";
import { KeymapButton } from "../../../../../components/layout/top-bar/keymap-button";
import { NavLogo } from "../../../../../components/logo/nav-logo";
import { Meta } from "../../../../../components/meta";
import { WelcomeModal } from "../../../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../../../components/workspace-switcher";
import { useDataset } from "../../../../../hooks";
import { Error404Content } from "../../../../404";

const DATASET_NAME_QUERY = gql`
  query GetDatasetNameQuery($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      name
    }
  }
`;

const DatasetClassesPage = () => {
  const { workspaceSlug, datasetSlug } = useDataset();

  const {
    data: datasetResult,
    error,
    loading,
  } = useQuery<{
    dataset: { id: string; name: string };
  }>(DATASET_NAME_QUERY, {
    variables: {
      slug: datasetSlug,
      workspaceSlug,
    },
    skip: !datasetSlug || !workspaceSlug,
  });

  const datasetName = datasetResult?.dataset.name;

  const handleError = useErrorHandler();
  if (error && !loading) {
    if (!error.message.match(/Couldn't find dataset corresponding to/)) {
      handleError(error);
    }
    return (
      <>
        <WelcomeModal />
        <AuthManager />
        <Meta title="LabelFlow | Dataset not found" />
        <CookieBanner />
        <Error404Content />
      </>
    );
  }

  return (
    <>
      <WelcomeModal />
      <AuthManager />
      <Meta title="LabelFlow | Classes" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <NextLink key={2} href={`/${workspaceSlug}/datasets`}>
            <BreadcrumbLink>Datasets</BreadcrumbLink>
          </NextLink>,
          <NextLink key={3} href={`/${workspaceSlug}/datasets/${datasetSlug}`}>
            <BreadcrumbLink>
              {datasetName ?? <Skeleton>Dataset Name</Skeleton>}
            </BreadcrumbLink>
          </NextLink>,
          <Text key={4}>Classes</Text>,
        ]}
        topBarRightContent={
          <>
            <KeymapButton />
            <ImportButton />
            <ExportButton />
          </>
        }
        tabBar={
          <DatasetTabBar
            currentTab="classes"
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
          />
        }
      >
        <Center>
          <DatasetClasses
            datasetSlug={datasetSlug}
            workspaceSlug={workspaceSlug}
          />
        </Center>
      </Layout>
    </>
  );
};

export default DatasetClassesPage;

export const getServerSideProps: GetServerSideProps = async () => {
  // https://stackoverflow.com/a/64242579
  resetServerContext();
  return { props: { data: [] } };
};
