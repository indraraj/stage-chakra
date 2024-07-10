import { EditIcon } from "@chakra-ui/icons";
import { Box, Text, Center, Flex, useColorMode, Icon } from "@chakra-ui/react";
import { Handle, Position } from "reactflow";
import ConnectorImage from "../ConnectorImage";
import { AppThemeGreen } from "../../utils/constants";

interface DataNodeProps {
  data: {
    connectorType: string;
    label: string;
    type: string;
    editAction: () => void;
    compositionFlow?: boolean;
  };
}

const DataNode: React.FC<DataNodeProps> = ({ data }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      shadow="md"
      cursor="auto"
      style={{
        borderRadius: "15px",
        padding: "5px",
        background: colorMode === "dark" ? "#2D3748" : "white",
      }}
    >
      {data.type === "source" && (
        <Handle type="source" position={Position.Right} id="smt-input" />
      )}
      <Icon
        display={data?.compositionFlow ? "none" : ""}
        as={EditIcon} // Change this to whatever icon you need
        position="absolute"
        top="4px"
        right="4px"
        boxSize={2.5}
        cursor="pointer"
        onClick={data.editAction}
      />

      <Center
        style={{
          background: colorMode === "dark" ? "#2D3748" : "white",
        }}
        mt="1"
        mr="1"
        ml="1"
      >
        <Flex direction="column">
          <Center>
            <Box
              bg={colorMode === "dark" ? "#2D3748" : AppThemeGreen.Background}
              lineHeight="normal"
              borderRadius="5"
              p="1"
            >
              <ConnectorImage connectorType={data.connectorType} size={9} />
            </Box>
          </Center>

          <Box pt="1" textAlign="center">
            <Text fontSize="x-small" fontWeight="bold">
              {data.label}
            </Text>
          </Box>
        </Flex>
      </Center>
      {data.type === "destination" && (
        <Handle type="target" position={Position.Left} id="smt-output" />
      )}
    </Box>
  );
};

export default DataNode;
