import {
  Box,
  Heading,
  Img,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import {
  BsFillLightningFill,
  BsFillShieldLockFill,
  BsHeartFill,
} from "react-icons/bs";
import { Feature } from "./Feature";

export const Features = () => {
  return (
    <Box as="section" py={{ md: "12" }} bg={mode("gray.50", "gray.800")}>
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        py={{ base: "12", md: "20" }}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="10">
          <Img
            htmlWidth="500px"
            htmlHeight="320px"
            height={{ md: "320px" }}
            objectFit="cover"
            src="/static/img/shot-elec-1.png"
            alt="state of the art speaker"
          />
          <Box>
            <Heading size="xl" mb="4" fontWeight="extrabold">
              Build the next big thing with AI
            </Heading>
            <Text
              fontSize={{ md: "lg" }}
              mb="6"
              maxW="md"
              color={mode("gray.600", "gray.400")}
            >
              You now have the tool to unleash the potential of all your AI
              project. Our team has 5 years of experience implementing AI at
              scale for energy companies with{" "}
              <Link color="brand.500" href="https://labelflow.ai/about">
                Sterblue
              </Link>
              , labeling 1.5 million images and involving tens of labelers and
              experts around the platform. We got your pains.
            </Text>
          </Box>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 3 }} mt="16" spacing="8">
          <Feature icon={BsFillLightningFill} title="Blazing Fast">
            Labelflow is designed for optimum productivity. Keyboard shortcuts,
            interface layout, collaboration, everything is designed with users,
            for users.
          </Feature>
          <Feature
            icon={BsFillShieldLockFill}
            title="Own your data and algorithms"
          >
            Labelflow does not try to own your data or algorithms, but
            integrates with them seamlessly. No duplicate source of truth and
            complicated scripts to synchronize your data between various tools.
          </Feature>
          <Feature icon={BsHeartFill} title="Open community and standard">
            Labelflow is building a community around an open source labeling
            tool to set the standard around visual data management. Dataset
            curation should not require any &ldquo;secret sauce&rdquo;.
          </Feature>
        </SimpleGrid>
      </Box>
    </Box>
  );
};
