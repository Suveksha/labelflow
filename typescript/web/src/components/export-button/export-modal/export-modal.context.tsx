import { gql, useQuery } from "@apollo/client";
import { ExportFormat } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

const countLabelsOfDatasetQuery = gql`
  query countLabelsOfDataset($slug: String!, $workspaceSlug: String!) {
    dataset(where: { slugs: { slug: $slug, workspaceSlug: $workspaceSlug } }) {
      id
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
    }
  }
`;

export interface ExportModalState {
  isOpen: boolean;
  onClose: () => void;
  exportFormat: ExportFormat;
  setExportFormat: Dispatch<SetStateAction<ExportFormat>>;
  loading: boolean;
  datasetId: string;
  datasetSlug: string;
  setIsExportRunning: Dispatch<SetStateAction<boolean>>;
  isExportRunning: boolean;
  imagesNumber: number;
  labelsNumber: number;
  isOptionsModalOpen: boolean;
  setIsOptionsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExportModalContext = createContext({} as ExportModalState);

export interface ExportModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export type ExportModalProviderProps = PropsWithChildren<ExportModalProps>;

export const ExportModalProvider = ({
  isOpen = false,
  onClose = () => {},
  children,
}: ExportModalProviderProps) => {
  const router = useRouter();
  const [exportFormat, setExportFormat] = useState(ExportFormat.Coco);
  const [isExportRunning, setIsExportRunning] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const { datasetSlug, workspaceSlug } = router?.query as {
    datasetSlug: string;
    workspaceSlug: string;
  };
  const { data, loading } = useQuery(countLabelsOfDatasetQuery, {
    variables: { slug: datasetSlug, workspaceSlug },
    skip: !datasetSlug || !isOpen,
  });

  const datasetId = data?.dataset.id;
  const imagesNumber: number = data?.dataset?.imagesAggregates?.totalCount ?? 0;
  const labelsNumber: number = data?.dataset?.labelsAggregates?.totalCount ?? 0;

  const value: ExportModalState = {
    isOpen,
    onClose,
    exportFormat,
    setExportFormat,
    loading,
    datasetId,
    datasetSlug,
    setIsExportRunning,
    isExportRunning,
    imagesNumber,
    labelsNumber,
    isOptionsModalOpen,
    setIsOptionsModalOpen,
  };

  return (
    <ExportModalContext.Provider value={value}>
      {children}
    </ExportModalContext.Provider>
  );
};

export const useExportModal = () => {
  return useContext(ExportModalContext);
};
