/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Flex,
  Text,
  Spacer,
  FormControl,
  FormLabel,
  Switch,
  Icon,
  Input,
  FormHelperText,
  Button,
  HStack,
  Select,
  useColorMode,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsCodeSquare } from "react-icons/bs";
import { API_URL, AppThemeGreen } from "../../utils/constants";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PageHeader from "../../components/PageHeader";
import { useData } from "../DataContext";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../utils/apis";
import ConnectorImage from "../../components/ConnectorImage";

const ConfigurePipeline: React.FC = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const [isSmartEditor, setIsSmartEditor] = useState(false);

  const [pipelineName, setPipelineName] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [pipelineNameError, setPipelineNameError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [logLevel, setLogLevel] = useState<string>("");
  const [logLevelError, setLogLevelError] = useState<string>("");

  const { source, destination } = useData();

  const lightBackground = colorMode === "dark" ? "gray.800" : "white";
  const darkBackground =
    colorMode === "dark" ? "gray.800" : `${AppThemeGreen.Background}`;

  const navigateTo = (url: string) => {
    navigate(url);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value.trim() !== "" && setPipelineNameError("");
    setPipelineName(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.target.value.trim() !== "" && setLogLevelError("");
    setLogLevel(event.target.value);
  };

  const createNewPipeline = async () => {
    const payload = {
      description: detail,
      name: pipelineName,
      source: {
        name: source?.name,
        id: source?.id,
      },
      destination: {
        name: destination?.name,
        id: destination?.id,
      },
      transforms: [],
      logLevel: logLevel,
    };

    const response = await createPost(`${API_URL}/api/pipelines`, payload);

    if (response.error) {
      console.error("Failed to create source:", response.error);
    } else {
      console.log("Source created successfully:", response.data);
    }
  };

  const handleCreatePipeline = () => {
    if (!pipelineName.trim()) {
      setPipelineNameError("Source name cannot be empty");
      return;
    }
    if (!logLevel.trim()) {
      setLogLevelError("logLevel cannot be empty");
      return;
    }

    // const payload = {
    //   name: pipelineName,
    //   source: {
    //     name: source?.name,
    //     id: source?.id,
    //   },
    //   destination: {
    //     name: destination?.name,
    //     id: destination?.id,
    //   },
    //   transforms: [],
    //   logLevel: logLevel,
    // };

    setIsLoading(true);

    // Add a 2-second delay
    setTimeout(async () => {
      await createNewPipeline();
      setIsLoading(false);
      navigate("/pipeline");
    }, 2000);
  };
  return (
    <>
      <PageHeader title="Create pipeline" isPadded />
      <Box
        mr="32"
        ml="32"
        bg={lightBackground}
        borderRadius="lg"
        p="4"
        shadow="md"
      >
        <Flex borderBottom="1px solid" pb="1">
          <Box>
            <Text fontSize="md">
              Fill the form below or use the smart editor to setup a new
              pipeline.
            </Text>
          </Box>
          <Spacer />
          <Box>
            <FormControl display="flex" alignItems="center">
              <FormLabel>
                <Flex align="center">
                  <Icon as={BsCodeSquare} w={5} h={5} mr="2" />
                  Smart editor
                </Flex>
              </FormLabel>
              <Switch
                id="smart-editor"
                isChecked={isSmartEditor}
                onChange={(e) => setIsSmartEditor(e.target.checked)}
              />
            </FormControl>
          </Box>
        </Flex>
        {!isSmartEditor ? (
          <>
            <Box pt="2">
              <Text fontSize="md">1. Capture details</Text>
              <Box
                bg={darkBackground}
                mt="1"
                pr="3"
                pl="3"
                pb="3"
                pt="2"
                borderRadius="lg"
              >
                <FormControl isRequired>
                  <FormLabel>Pipeline</FormLabel>
                  <HStack>
                    <Box width="35px">
                      <ConnectorImage connectorType={source?.type ?? ""} />
                    </Box>
                    <Icon boxSize="6" as={ArrowForwardIcon} />
                    <Box width="35px">
                      <ConnectorImage connectorType={destination?.type ?? ""} />
                    </Box>
                  </HStack>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Pipeline name</FormLabel>
                  <Input
                    type="text"
                    bg={lightBackground}
                    isInvalid={!!pipelineNameError}
                    errorBorderColor="crimson"
                    value={pipelineName}
                    onChange={handleNameChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Detail</FormLabel>
                  <Input
                    type="text"
                    bg={lightBackground}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <FormHelperText>
                    Add a one liner to describe your pipeline or what you plan
                    to capture.
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>
            <Box pt="2">
              <Text fontSize="md">2. Configuration properties</Text>
              <Box
                bg={darkBackground}
                mt="1"
                pr="3"
                pl="3"
                pb="3"
                pt="2"
                borderRadius="lg"
              >
                <FormControl isRequired>
                  <FormLabel>Log level</FormLabel>
                  <Select
                    bg={lightBackground}
                    defaultValue="placeholder"
                    isInvalid={!!logLevelError}
                    errorBorderColor="crimson"
                    onChange={handleSelectChange}
                  >
                    <option value="placeholder" disabled>
                      Select option
                    </option>
                    <option value="OFF">OFF</option>
                    <option value="FATAL">FATAL</option>
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                    <option value="DEBUG">DEBUG</option>
                    <option value="TRACE">TRACE</option>
                    <option value="ALL">ALL</option>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </>
        ) : (
          <Box m="2" border="1px" borderColor="gray.500" height="600px"></Box>
        )}

        <Flex pt="4">
          <Box>
            <Button
              variant="outline"
              onClick={() => navigateTo("/pipeline/pipeline_designer")}
            >
              Back
            </Button>
          </Box>
          <Spacer />
          <Box>
            <Button
              variant="solid"
              onClick={handleCreatePipeline}
              isLoading={isLoading}
              loadingText="Create pipeline"
            >
              Create pipeline
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default ConfigurePipeline;
