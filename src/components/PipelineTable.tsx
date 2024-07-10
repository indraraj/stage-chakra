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
  Text,
  Switch,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdArrowDownward, MdOutlineMoreVert } from "react-icons/md";
import { PipelineApiResponse, Pipeline, deleteResource } from "../utils/apis";
import SourceField from "./SourceField";
import DestinationField from "./DestinationField";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constants";

interface PipelineTableProps {
  data: PipelineApiResponse;
  onClear: () => void;
  isFiltered: boolean;
}

type deleteInstance = {
  id: number;
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const PhaseIndicator = (
//   <CustomTd>
//     <Box w="150px">
//       <Stepper index={3} size="sx" colorScheme="blue">
//         <Step>
//           <StepIndicator border="2px" borderColor="gray.200">
//             <StepStatus
//               complete={<StepIcon />}
//               incomplete={<StepIcon />}
//               active={<StepIcon />}
//             />
//           </StepIndicator>

//           <StepSeparator />
//         </Step>
//         <Step>
//           <StepIndicator border="2px" borderColor="gray.200">
//             <StepStatus
//               complete={<StepIcon />}
//               incomplete={<StepIcon />}
//               active={<StepIcon />}
//             />
//           </StepIndicator>

//           <StepSeparator />
//         </Step>
//         <Step>
//           <StepIndicator border="2px" borderColor="gray.200">
//             <StepStatus
//               complete={<StepIcon />}
//               incomplete={<StepIcon />}
//               active={<StepIcon />}
//             />
//           </StepIndicator>

//           <StepSeparator />
//         </Step>
//       </Stepper>
//     </Box>
//   </CustomTd>
// );

const PipelineTable: React.FC<PipelineTableProps> = ({
  data,
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

  // const { mutate: deletePipeline, isLoading: isDeleting } = useDeleteData();

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    const url = `${API_URL}/api/pipelines/${id}`;
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
    navigate(`/pipeline/${instanceId}/edit`);
  };

  const onOverviewClick = (instanceId: string) => {
    navigate(`/pipeline/${instanceId}/overview`);
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
              "List of configured active pipelines."
            ) : data.length === 0 ? (
              <>
                {"No matching pipeline is present. "}
                <br />
                <Button variant="link" onClick={onClear}>
                  Clear search field
                </Button>
              </>
            ) : (
              "List of configured active pipelines matching the search result."
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
              <Th>Source</Th>
              <Th>Destination</Th>
              <Th>Phase</Th>
              <Th>Enabled</Th>
              <Th isNumeric></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((pipeline: Pipeline) => (
              <Tr key={pipeline.id}>
                <Td>{pipeline.name}</Td>
                <SourceField pipelineSource={pipeline.source} />
                <DestinationField pipelineDestination={pipeline.destination} />
                <Td>*</Td>
                <Td>
                  <Switch size="md" isChecked isDisabled />
                </Td>
                <Td isNumeric>
                  <Menu>
                    <MenuButton>
                      <MdOutlineMoreVert />
                    </MenuButton>

                    <MenuList>
                      <MenuGroup title="Actions" textAlign="left">
                      <MenuDivider/>
                      <MenuItem  isDisabled>
                          Pause
                        </MenuItem>
                        <MenuItem isDisabled>
                          Resume
                        </MenuItem>
                        <MenuItem
                          onClick={() => onOverviewClick("" + pipeline.id)}
                        >
                          Overview
                        </MenuItem>
                        <MenuDivider/>
                        <MenuItem onClick={() => onEditClick("" + pipeline.id)}>
                          Edit
                        </MenuItem>
                        
                        <MenuItem
                          onClick={() =>
                            onDeleteHandler(pipeline.id, pipeline.name)
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
          <ModalHeader>Delete pipeline</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Enter '{deleteInstance.name}' to delete.</FormLabel>
              <Input
                placeholder={`Enter pipeline name`}
                onChange={(e) => setDeleteInstanceName(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleDelete(deleteInstance.id)}
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

export default PipelineTable;
