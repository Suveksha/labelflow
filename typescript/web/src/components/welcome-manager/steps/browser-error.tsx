import { useRef, useEffect } from "react";
import {
  chakra,
  ModalContent,
  ModalFooter,
  VStack,
  Stack,
  Button,
  Heading,
  Link,
  Center,
  Text,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useErrorHandler } from "react-error-boundary";
import { RiArrowGoBackLine, RiPlayFill } from "react-icons/ri";

import BrowserCancel from "../../graphics/browser-cancel";

const ChakraBrowserCancel = chakra(BrowserCancel);

const BackIcon = chakra(RiArrowGoBackLine);
const PlayIcon = chakra(RiPlayFill);
type Props = {
  error?: Error;
};

export const BrowserError = ({ error }: Props) => {
  const startLabelingButtonRef = useRef<HTMLButtonElement>(null);
  const handleError = useErrorHandler();

  // Start the timer during the first render
  useEffect(() => {
    startLabelingButtonRef.current?.focus();
  }, []);
  return (
    <ModalContent margin={{ base: "4", md: "3.75rem" }}>
      <ModalHeader textAlign="center" padding={{ base: "4", md: "8" }}>
        <Center>
          <ChakraBrowserCancel
            my={{ base: "4", md: "10" }}
            width="40"
            height={{ base: "16", md: "40" }}
          />
        </Center>
      </ModalHeader>

      <ModalBody>
        <VStack
          justifyContent="space-evenly"
          spacing="8"
          h="full"
          mt="0"
          mb={{ base: "4", md: "8" }}
        >
          <Heading
            as="h1"
            size="2xl"
            maxW="lg"
            color={mode("gray.600", "gray.300")}
            fontWeight="extrabold"
            textAlign="center"
          >
            Incompatible browser
          </Heading>
          <Text
            color={mode("gray.600", "gray.400")}
            maxW="lg"
            fontSize="lg"
            fontWeight="medium"
            textAlign="justify"
          >
            Your browser threw an Error while initializing LabelFlow. For
            technical reasons, LabelFlow requires to use the latest version of{" "}
            <Link
              href="https://www.mozilla.org/firefox/new"
              color="brand.600"
              isExternal
            >
              Firefox
            </Link>
            ,{" "}
            <Link
              href="https://brave.com/download/"
              color="brand.600"
              isExternal
            >
              Brave
            </Link>
            ,{" "}
            <Link
              href="https://www.microsoft.com/edge"
              color="brand.600"
              isExternal
            >
              Edge
            </Link>
            ,{" "}
            <Link
              href="https://www.google.com/chrome/"
              color="brand.600"
              isExternal
            >
              Chrome
            </Link>{" "}
            or{" "}
            <Link
              href="https://www.apple.com/safari/"
              color="brand.600"
              isExternal
            >
              Safari
            </Link>
            , not in incognito mode, not on a mobile terminal.
            {/* , and with any ad blocker disabled. */}
          </Text>
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Stack
          direction={{ base: "column", md: "row" }}
          justifyContent="center"
          width="full"
          spacing="4"
          mb={{ base: "0", md: "10" }}
        >
          <NextLink href="/">
            <Button
              as="a"
              leftIcon={<BackIcon fontSize="xl" />}
              href="/"
              size="lg"
              minW="210px"
              variant="link"
              height="14"
              px="8"
            >
              Back to Website
            </Button>
          </NextLink>
          <Button
            ref={startLabelingButtonRef}
            leftIcon={<PlayIcon fontSize="xl" />}
            size="lg"
            minW="210px"
            colorScheme="red"
            height="14"
            px="8"
            isLoading={false}
            onClick={() => {
              handleError(error);
            }}
            variant="link"
            loadingText="Loading the app"
          >
            See Error...
          </Button>
        </Stack>
      </ModalFooter>
    </ModalContent>
  );
};
