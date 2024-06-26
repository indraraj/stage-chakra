import {
  Center,
  Flex,
  Heading,
  Box,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
}) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      bg={colorMode !== "dark" ? "white" : "gray.700"}
      p={4}
      h="500px"
      border="1px dashed"
      borderColor={colorMode !== "dark" ? "gray.300" : "blackAlpha.800"}
      borderRadius="lg"
      mt="lg"
    >
      <Center h="inherit">
        <Flex direction="column" align="center">
          <Box>{icon}</Box>
          <Box textAlign="center" p="4">
            <Box>
              <Heading size="md">{title}</Heading>
            </Box>
            <Box>
              <Text fontSize="md">{message}</Text>
            </Box>
          </Box>

          <Box padding={4}>{action}</Box>
        </Flex>
      </Center>
    </Box>
  );
};

export default EmptyState;
