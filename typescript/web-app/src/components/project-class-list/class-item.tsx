import { useState, useEffect, useCallback } from "react";
import { gql, useApolloClient } from "@apollo/client";
import {
  Kbd,
  Text,
  IconButton,
  Flex,
  chakra,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import {
  RiCheckboxBlankCircleFill,
  RiPencilFill,
  RiCheckFill,
  RiCloseFill,
  RiDeleteBin5Fill,
} from "react-icons/ri";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);
const PenIcon = chakra(RiPencilFill);
const CheckIcon = chakra(RiCheckFill);
const CloseIcon = chakra(RiCloseFill);
const DeleteIcon = chakra(RiDeleteBin5Fill);

export type ProjectClassesQueryResult = {
  project: {
    id: string;
    name: string;
    labelClasses: {
      id: string;
      name: string;
      color: string;
    }[];
  };
};

type ClassItemProps = {
  id: string;
  name: string;
  color: string;
  shortcut: string | null;
  edit: boolean;
  setEditClassId: (classId: string | null) => void;
  projectId: string;
  setDeleteClassId: (classId: string | null) => void;
};

export const projectLabelClassesQuery = gql`
  query getProjectLabelClasses($projectId: ID!) {
    project(where: { id: $projectId }) {
      id
      name
      labelClasses {
        id
        name
        color
      }
    }
  }
`;

const updateLabelClassNameMutation = gql`
  mutation updateLabelClassName($id: ID!, $name: String!) {
    updateLabelClass(where: { id: $id }, data: { name: $name }) {
      id
      name
    }
  }
`;

export const ClassItem = ({
  id,
  name,
  color,
  shortcut,
  edit,
  setEditClassId,
  projectId,
  setDeleteClassId,
}: ClassItemProps) => {
  const [editName, setEditName] = useState<string | null>(null);

  const client = useApolloClient();
  useEffect(() => {
    if (edit) {
      setEditName(name);
    } else {
      setEditName(null);
    }
  }, [edit]);

  const updateLabelClassNameWithOptimistic = useCallback(() => {
    setEditClassId(null);
    client.mutate({
      mutation: updateLabelClassNameMutation,
      variables: { id, name: editName },
      optimisticResponse: {
        updateLabelClass: {
          id,
          name: editName,
          color,
          __typeName: "LabelClass",
        },
      },
      update: (cache, { data }) => {
        if (data != null) {
          const { updateLabelClass } = data;
          const projectCacheResult = cache.readQuery<ProjectClassesQueryResult>(
            {
              query: projectLabelClassesQuery,
              variables: { projectId },
            }
          );
          if (projectCacheResult?.project == null) {
            throw new Error(`Missing project with id ${projectId}`);
          }
          const { project } = projectCacheResult;
          const updatedProject = {
            ...project,
            labelClasses: project.labelClasses.map((labelClass) =>
              labelClass.id !== id ? labelClass : { ...updateLabelClass }
            ),
          };
          cache.writeQuery({
            query: projectLabelClassesQuery,
            data: { project: updatedProject },
          });
        }
      },
    });
  }, [editName, id, projectId, setEditClassId]);

  return (
    <Flex alignItems="center" height="10">
      <CircleIcon
        flexShrink={0}
        flexGrow={0}
        color={color}
        fontSize="2xl"
        ml="2"
        mr="2"
      />

      {edit && editName != null ? (
        <Input
          aria-label="edit-class-name-input"
          variant="flushed"
          flexGrow={1}
          isTruncated
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && editName !== "") {
              updateLabelClassNameWithOptimistic();
            }
          }}
        />
      ) : (
        <Text flexGrow={1} isTruncated>
          {name}
        </Text>
      )}

      {shortcut && (
        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
          {shortcut}
        </Kbd>
      )}

      {edit && editName != null ? (
        <>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label="Cancel"
            aria-label="Cancel"
          >
            <IconButton
              variant="ghost"
              aria-label="Cancel"
              icon={<CloseIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              minWidth="8"
              onClick={() => setEditClassId(null)}
            />
          </Tooltip>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label="Save"
            aria-label="Save"
          >
            <IconButton
              variant="ghost"
              aria-label="Save"
              icon={<CheckIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              mr="2"
              minWidth="8"
              onClick={updateLabelClassNameWithOptimistic}
              disabled={editName === ""}
            />
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label={`Edit name of class ${name}`}
            aria-label={`Edit name of class ${name}`}
          >
            <IconButton
              variant="ghost"
              aria-label={`Edit class ${name} name`}
              icon={<PenIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              minWidth="8"
              onClick={() => setEditClassId(id)}
            />
          </Tooltip>
          <Tooltip
            placement="bottom"
            openDelay={300}
            label={`Delete class ${name}`}
            aria-label={`Delete class ${name}`}
          >
            <IconButton
              variant="ghost"
              aria-label={`Delete class ${name}`}
              icon={<DeleteIcon flexShrink={0} flexGrow={0} color="gray.600" />}
              h="8"
              w="8"
              mr="2"
              minWidth="8"
              onClick={() => setDeleteClassId(id)}
            />
          </Tooltip>
        </>
      )}
    </Flex>
  );
};
