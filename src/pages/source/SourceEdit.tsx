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
  Grid,
  GridItem,
  Button,
  Center,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsCodeSquare } from "react-icons/bs";
import { API_URL, AppThemeGreen } from "../../utils/constants";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import PageHeader from "../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { convertMapToObject } from "../../utils/helpers";
import {
  Source,
  SourceConfig,
  editPut,
  fetchDataTypeTwo,
} from "../../utils/apis";
import _ from "lodash";
import ConnectorImage from "../../components/ConnectorImage";

const SourceEdit: React.FC = () => {
  const { colorMode } = useColorMode();
  const { sourceId } = useParams<{ sourceId: string }>();
  const navigate = useNavigate();

  const [isSmartEditor, setIsSmartEditor] = useState(false);

  const [sourceName, setSourceName] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [sourceNameError, setSourceNameError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Configuration Properties
  const [properties, setProperties] = useState<
    Map<string, { key: string; value: string }>
  >(new Map([["key0", { key: "", value: "" }]]));

  const [keyCount, setKeyCount] = useState<number>(1);

  const [source, setSource] = useState<Source>();
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const setConfigProperties = (configProp: SourceConfig) => {
    let i = 0;
    const configMap = new Map();
    for (const config in configProp) {
      configMap.set(`key${i}`, { key: config, value: configProp[config] });
      i++;
    }
    setProperties(configMap);
  };

  useEffect(() => {
    const fetchSources = async () => {
      setIsFetchLoading(true);
      const response = await fetchDataTypeTwo<Source>(
        `${API_URL}/api/sources/${sourceId}`
      );

      if (response.error) {
        setError(response.error);
      } else {
        setSource(response.data);
        setSourceName(response.data?.name ?? "");
        setDetail(response.data?.description ?? "");
        setConfigProperties(response.data?.config ?? { "": "" });
      }

      setIsFetchLoading(false);
    };

    fetchSources();
  }, [sourceId]);

  const handleAddProperty = () => {
    const newKey = `key${keyCount}`;
    setProperties(
      (prevProperties) =>
        new Map(prevProperties.set(newKey, { key: "", value: "" }))
    );
    setKeyCount((prevCount) => prevCount + 1);
  };

  const handleDeleteProperty = (key: string) => {
    setProperties((prevProperties) => {
      const newProperties = new Map(prevProperties);
      newProperties.delete(key);
      return newProperties;
    });
  };

  const handlePropertyChange = (
    key: string,
    type: "key" | "value",
    newValue: string
  ) => {
    setProperties((prevProperties) => {
      const newProperties = new Map(prevProperties);
      const property = newProperties.get(key);
      if (property) {
        if (type === "key") property.key = newValue;
        else if (type === "value") property.value = newValue;
        newProperties.set(key, property);
      }
      return newProperties;
    });
  };

  const navigateTo = (url: string) => {
    navigate(url);
  };

  const editSource = async () => {
    const payload = {
      description: detail,
      config: convertMapToObject(properties),
      name: sourceName,
    };

    const response = await editPut(
      `${API_URL}/api/sources/${sourceId}`,
      payload
    );

    if (response.error) {
      console.error("Failed to create source:", response.error);
    } else {
      console.log("Source created successfully:", response.data);
    }
  };

  const handleEditSource = () => {
    if (!sourceName.trim()) {
      setSourceNameError("Source name cannot be empty");
      return;
    }

    setIsLoading(true);

    // Add a 2-second delay
    setTimeout(async () => {
      await editSource();
      setIsLoading(false);
      navigate("/source");
    }, 2000);
  };

  if (isFetchLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <PageHeader title="Edit source" isPadded />
      <Box
        mr="32"
        ml="32"
        bg={colorMode === "dark" ? "gray.700" : "white"}
        borderRadius="lg"
        p="4"
        shadow="md"
      >
        <Flex borderBottom="1px solid" pb="1">
          <Box>
            <Text fontSize="md">
              Edit the form below or use the smart editor to edit the already
              configured source connector.
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
              {/* <Tooltip label="In development: coming soon!"> */}
              <Switch
                id="smart-editor"
                isChecked={isSmartEditor}
                onChange={(e) => setIsSmartEditor(e.target.checked)}
              />
              {/* </Tooltip> */}
            </FormControl>
          </Box>
        </Flex>
        {!isSmartEditor ? (
          <>
            <Box pt="2">
              <Text fontSize="md">1. Capture details</Text>
              <Box
                bg={`${
                  colorMode === "dark"
                    ? "gray.800"
                    : `${AppThemeGreen.Background}`
                }`}
                mt="1"
                pr="3"
                pl="3"
                pb="3"
                pt="2"
                borderRadius="lg"
              >
                <FormControl isRequired pb="1">
                  <FormLabel>Source type</FormLabel>
                  <Box width="50px">
                    <ConnectorImage connectorType={source?.type ?? ""} />
                  </Box>
                </FormControl>
                <FormControl isRequired pb="1">
                  <FormLabel>Source name</FormLabel>
                  <Input
                    type="text"
                    bg={colorMode === "dark" ? "gray.700" : "white"}
                    isInvalid={!!sourceNameError}
                    errorBorderColor="crimson"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                  />
                </FormControl>
                <FormControl pb="1">
                  <FormLabel>Detail</FormLabel>
                  <Input
                    type="text"
                    bg={colorMode === "dark" ? "gray.700" : "white"}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <FormHelperText>
                    Add a one liner to describe your source or what you plan to
                    capture.
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>
            <Box pt="2">
              <Text fontSize="md">2. Configuration properties</Text>
              <Box
                bg={`${
                  colorMode === "dark"
                    ? "gray.800"
                    : `${AppThemeGreen.Background}`
                }`}
                mt="1"
                pr="3"
                pl="3"
                pb="3"
                pt="2"
                borderRadius="lg"
              >
                {/* <Grid gap={6} templateColumns="5.5fr 5.5fr 1fr" pb="4">
                  <GridItem>
                    <FormLabel>
                      <Flex align="center">
                        mongodb.ssl.enabled
                        <Center
                          ml="4"
                          bg="white"
                          w={8}
                          h={8}
                          borderRadius="md"
                          cursor="pointer"
                        >
                          <Icon as={EditIcon} w={5} h={5} />
                        </Center>
                      </Flex>
                    </FormLabel>
                  </GridItem>
                  <GridItem>
                    <Input
                      type="text"
                      bg="white"
                      placeholder="Property value"
                    />
                  </GridItem>
                  <GridItem>
                    <Center height="100%">
                      <Tooltip label="Delete property" aria-label="A tooltip">
                        <Center
                          bg="white"
                          height="100%"
                          width="50px"
                          borderRadius="md"
                          cursor="pointer"
                        >
                          <DeleteIcon />
                        </Center>
                      </Tooltip>
                    </Center>
                  </GridItem>
                </Grid> */}
                {Array.from(properties.keys()).map((key) => (
                  <Grid
                    key={key}
                    gap={6}
                    templateColumns="5.5fr 5.5fr 1fr"
                    pb="4"
                  >
                    <GridItem>
                      <Input
                        type="text"
                        bg={colorMode === "dark" ? "gray.700" : "white"}
                        placeholder="Property key"
                        value={properties.get(key)?.key || ""}
                        onChange={(e) =>
                          handlePropertyChange(key, "key", e.target.value)
                        }
                      />
                    </GridItem>
                    <GridItem>
                      <Input
                        type="text"
                        bg={colorMode === "dark" ? "gray.700" : "white"}
                        placeholder="Property value"
                        value={properties.get(key)?.value || ""}
                        onChange={(e) =>
                          handlePropertyChange(key, "value", e.target.value)
                        }
                      />
                    </GridItem>
                    <GridItem>
                      <Center height="100%">
                        <Tooltip label="Delete property" aria-label="A tooltip">
                          <Center
                            bg={colorMode === "dark" ? "gray.700" : "white"}
                            height="100%"
                            width="50px"
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => handleDeleteProperty(key)}
                          >
                            <DeleteIcon />
                          </Center>
                        </Tooltip>
                      </Center>
                    </GridItem>
                  </Grid>
                ))}
                <Button
                  leftIcon={<AddIcon />}
                  variant="outline"
                  mb="4"
                  onClick={handleAddProperty}
                >
                  Add property
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <Box m="2" border="1px" borderColor="gray.500" height="600px">
            {/* <CustomFlow /> */}
          </Box>
        )}

        <Flex pt="4">
          <Box>
            <Button
              variant="outline"
              onClick={() => navigateTo("/source/catalog")}
            >
              Cancel
            </Button>
          </Box>
          <Spacer />
          <Box>
            <Button
              variant="solid"
              onClick={handleEditSource}
              isLoading={isLoading}
              loadingText="Save"
            >
              Save
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default SourceEdit;
