import { gql, useQuery } from "@apollo/client";
import { Box, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { AuthManager } from "../../../components/auth-manager";
import { CookieBanner } from "../../../components/cookie-banner";
import { Layout } from "../../../components/layout";
import { WorkspaceTabBar } from "../../../components/layout/tab-bar/workspace-tab-bar";
import { NavLogo } from "../../../components/logo/nav-logo";
import { Meta } from "../../../components/meta";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { WorkspaceSettings } from "../../../components/settings/workspace";
import { LayoutSpinner } from "../../../components/spinner";
import { WelcomeManager } from "../../../components/welcome-manager";
import { WorkspaceSwitcher } from "../../../components/workspace-switcher";

const getWorkspaceDetailsQuery = gql`
  query getWorkspaceDetails($workspaceSlug: String) {
    workspace(where: { slug: $workspaceSlug }) {
      id
      plan
      slug
      image
      name
      stripeCustomerPortalUrl
    }
  }
`;

const WorkspaceSettingsPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug as string;

  const {
    data: getWorkspaceDetailsData,
    previousData: getWorkspaceDetailsPreviousData,
  } = useQuery(getWorkspaceDetailsQuery, {
    variables: { workspaceSlug },
    skip: workspaceSlug == null,
  });

  const getWorkspaceDetailsFinalData =
    getWorkspaceDetailsData?.workspace ??
    getWorkspaceDetailsPreviousData?.workspace;

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Workspace Settings" />
      <CookieBanner />
      <Layout
        breadcrumbs={[
          <NavLogo key={0} />,
          <WorkspaceSwitcher key={1} />,
          <Text key={2}>Settings</Text>,
        ]}
        tabBar={
          <WorkspaceTabBar
            currentTab="settings"
            workspaceSlug={workspaceSlug}
          />
        }
      >
        {getWorkspaceDetailsFinalData ? (
          <Box p={8}>
            <WorkspaceSettings workspace={getWorkspaceDetailsFinalData} />
          </Box>
        ) : (
          <LayoutSpinner />
        )}
      </Layout>
    </>
  );
};

export default WorkspaceSettingsPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query?.workspaceSlug === "local") {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
