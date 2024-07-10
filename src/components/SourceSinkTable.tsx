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
  useColorMode,
  Button,
  MenuGroup,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormLabel,
  MenuDivider,
} from "@chakra-ui/react";
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

interface SourceSinkTableProps {
  tableType: "source" | "destination";
  data: SourceApiResponse | DestinationApiResponse;
  onClear: () => void;
  isFiltered: boolean;
}

type deleteInstance = {
  id: number;
  name: string;
};

const SourceSinkTable: React.FC<SourceSinkTableProps> = ({
  data,
  tableType,
  onClear,
  isFiltered,
}) => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteInstance, setDeleteInstance] = useState<deleteInstance>({
    id: 0,
    name: "",
  });
  const [deleteInstanceName, setDeleteInstanceName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: number, type: string) => {
    setIsLoading(true);
    const resourceType = type === "source" ? "sources" : "destinations";
    const url = `${API_URL}/api/${resourceType}/${id}`;
    const result = await deleteResource(url);

    if (result.error) {
      console.error(result.error);
      setIsOpen(false);
      setIsLoading(false);
    } else {
      console.log("Resource deleted successfully", result.data);
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const onDeleteHandler = (id: number, name: string) => {
    setIsOpen(true);
    setDeleteInstance({ id: id, name: name });
  };

  const onEditClick = (instanceId: string) => {
    navigate(
      tableType === "source"
        ? `/source/${instanceId}/edit`
        : `/destination/${instanceId}/edit`
    );
  };

  return (
    <>
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
                      <MenuGroup title="Actions" textAlign="left">
                        <MenuDivider />
                        <MenuItem onClick={() => onEditClick("" + instance.id)}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            onDeleteHandler(instance.id, instance.name)
                          }
                        >
                          Delete
                        </MenuItem>
                      </MenuGroup>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete {tableType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter '{deleteInstance.name}' to delete.</FormLabel>
              <Input
                placeholder={`Enter ${tableType} name`}
                onChange={(e) => setDeleteInstanceName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete(deleteInstance.id, tableType)}
              isDisabled={deleteInstanceName !== deleteInstance.name}
              isLoading={isLoading}
              loadingText="Delete"
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SourceSinkTable;
