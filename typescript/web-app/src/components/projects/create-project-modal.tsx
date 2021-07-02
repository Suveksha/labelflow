import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash/fp/debounce";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalHeader,
  Heading,
  ModalBody,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

const debounceTime = 200;

const createProjectMutation = gql`
  mutation createProject($name: String!) {
    createProject(data: { name: $name }) {
      id
    }
  }
`;

const getProjectByNameQuery = gql`
  query getProjectByName($name: String) {
    project(where: { name: $name }) {
      name
    }
  }
`;

const getProjectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      images {
        url
      }
    }
  }
`;

export const CreateProjectModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasAdded, setHasAdded] = useState(false);
  const [queryExistingProjects, { data: existingProject }] = useLazyQuery(
    getProjectByNameQuery
  );
  const { refetch: refetchProjects } = useQuery(getProjectsQuery);
  const [createProjectMutate] = useMutation(createProjectMutation, {
    variables: {
      name: projectName,
    },
  });

  const closeModal = useCallback(() => {
    onClose();
    setErrorMessage("");
    setInputValue("");
  }, []);

  useEffect(() => {
    if (hasAdded) {
      refetchProjects();
      setHasAdded(false);
    }
  }, [hasAdded]);

  const handleInputValueChange = (e: any) => {
    setInputValue(e.target.value);
    setProjectName(e.target.value.trim());
  };

  const debouncedQuery = useRef(
    debounce(debounceTime, (nextName: string) => {
      queryExistingProjects({
        variables: { name: nextName },
      });
    })
  ).current;

  useEffect(() => {
    if (projectName === "") return;

    debouncedQuery(projectName);
  }, [projectName]);

  useEffect(() => {
    if (existingProject != null) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingProject]);

  const createProject = async () => {
    if (projectName === "") return;

    try {
      await createProjectMutate();

      closeModal();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const isInputValid = () => errorMessage === "";

  const canCreateProject = () => projectName !== "" && isInputValid();

  return (
    <Modal isOpen={isOpen} size="xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          createProject();
          setHasAdded(true);
        }}
      >
        <ModalCloseButton />

        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            New Project
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="20" pl="20">
          <FormControl isInvalid={!isInputValid()} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={inputValue}
              placeholder="Project name"
              size="md"
              onChange={handleInputValueChange}
              aria-label="Project name input"
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            disabled={!canCreateProject()}
            aria-label="Create project"
          >
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
