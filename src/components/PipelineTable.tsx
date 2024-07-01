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
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { MdArrowDownward, MdOutlineMoreVert } from "react-icons/md";
import { PipelineApiResponse, Pipeline, useDeleteData } from "../utils/apis";
import SourceField from "./SourceField";
import DestinationField from "./DestinationField";

interface PipelineTableProps {
  data: PipelineApiResponse;
  onClear: () => void;
  isFiltered: boolean;
}

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
  const { mutate: deletePipeline, isLoading: isDeleting } = useDeleteData();

  const onDeleteHandler = (id: string) => {
    deletePipeline(id);
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
                    <MenuItem isDisabled>Overview</MenuItem>
                    <MenuItem isDisabled>Edit</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={() => onDeleteHandler("" + pipeline.id)}>
                      {isDeleting ? "Deleting..." : "Delete"}
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

export default PipelineTable;
