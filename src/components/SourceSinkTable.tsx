import { ArrowDownIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Stack,
  Icon,
  Tbody,
  Td,
  Badge,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { MdArrowDownward, MdOutlineMoreVert } from "react-icons/md";
import {
  DestinationApiResponse,
  Source,
  SourceApiResponse,
  deleteResource,
} from "../utils/apis";
import { BsTags } from "react-icons/bs";
import ConnectorImage from "./ConnectorImage";
import { getConnectorTypeName } from "../utils/helpers";
import { API_URL } from "../utils/constants";

interface SourceSinkTableProps {
  tableType: "source" | "destination";
  data: SourceApiResponse | DestinationApiResponse;
  onClear: () => void;
  isFiltered: boolean;
}

const SourceSinkTable: React.FC<SourceSinkTableProps> = ({
  data,
  tableType,
  onClear,
  isFiltered,
}) => {
  const { colorMode } = useColorMode();
  const handleDelete = async (id: number, type: string) => {
    const resourceType = type === "source" ? "sources" : "destinations";
    const url = `${API_URL}/api/${resourceType}/${id}`;
    const result = await deleteResource(url);

    if (result.error) {
      console.error(result.error);
    } else {
      console.log("Resource deleted successfully", result.data);
    }
  };

  const onDeleteHandler = (id: number) => {
    handleDelete(id, tableType);
  };
  return (
    <TableContainer
      bg={colorMode !== "dark" ? "white" : "gray.700"}
      borderRadius="lg"
      p="2"
      border="1px"
      borderColor={colorMode !== "dark" ? "gray.300" : "gray.600"}
    >
      <Table variant="simple">
        <TableCaption>
          {!isFiltered ? (
            `List of configured active ${tableType}.`
          ) : data.length === 0 ? (
            <>
              {`No matching ${tableType} is present. `}
              <br />
              <Button variant="link" onClick={onClear}>
                Clear search field
              </Button>
            </>
          ) : (
            `List of configured active ${tableType} matching the search result.`
          )}
        </TableCaption>
        <Thead>
          <Tr>
            <Th>
              <Stack direction="row" align="center" spacing={2}>
                <Text fontSize="xm">Name</Text>
                <Icon boxSize="4" as={MdArrowDownward} />
              </Stack>
            </Th>
            <Th>Type</Th>
            <Th>
              <Stack direction="row" align="center" spacing={2}>
                <Text fontSize="xm">Active</Text>
                <Icon boxSize="4" as={ArrowDownIcon} />
              </Stack>
            </Th>
            <Th isNumeric></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((instance: Source) => (
            <Tr key={instance.id}>
              <Td>{instance.name}</Td>
              <Td>
                <Stack direction="row" align="center" spacing={2}>
                  <ConnectorImage connectorType={instance.type} size={8} />
                  <Text fontSize="md">
                    {getConnectorTypeName(instance.type)}
                  </Text>
                </Stack>
              </Td>
              <Td>
                <Tooltip label={`Used in 0 pipeline`}>
                  <Badge
                    variant="outline"
                    borderRadius="lg"
                    colorScheme="blue"
                    pl="2"
                    pr="2"
                    pt="1"
                    pb="1"
                    cursor="pointer"
                  >
                    <Icon as={BsTags} />
                    &nbsp; 0
                  </Badge>
                </Tooltip>
              </Td>
              <Td isNumeric>
                <Menu>
                  <MenuButton>
                    <MdOutlineMoreVert />
                  </MenuButton>
                  <MenuList>
                    <MenuItem isDisabled>Overview</MenuItem>
                    <MenuItem isDisabled>Edit</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => onDeleteHandler(instance.id)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default SourceSinkTable;
