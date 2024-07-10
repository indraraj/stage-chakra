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
  Destination,
  DestinationConfig,
  createPost,
  fetchDataTypeTwo,
} from "../../utils/apis";
import ConnectorImage from "../../components/ConnectorImage";

const DestinationEdit: React.FC = () => {
  const { colorMode } = useColorMode();
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();

  const [destinationName, setDestinationName] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [destinationNameError, setDestinationNameError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Configuration Properties
  const [properties, setProperties] = useState<
    Map<string, { key: string; value: string }>
  >(new Map([["key0", { key: "", value: "" }]]));

  const [keyCount, setKeyCount] = useState<number>(1);

  const [destination, setDestination] = useState<Destination>();
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const setConfigProperties = (configProp: DestinationConfig) => {
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
      const response = await fetchDataTypeTwo<Destination>(
        `${API_URL}/api/destinations/${destinationId}`
      );

      if (response.error) {
        setError(response.error);
      } else {
        setDestination(response.data);
        setDestinationName(response.data?.name ?? "");
        setDetail(response.data?.description ?? "");
        setConfigProperties(response.data?.config ?? { "": "" });
      }

      setIsFetchLoading(false);
    };

    fetchSources();
  }, [destinationId]);

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

  const createNewDestination = async () => {
    const payload = {
      description: detail,

      config: convertMapToObject(properties),
      name: destinationName,
    };

    const response = await createPost(`${API_URL}/api/destinations`, payload);

    if (response.error) {
      console.error("Failed to create source:", response.error);
    } else {
      console.log("Source created successfully:", response.data);
    }
  };

  const handleCreateDestination = async () => {
    if (!destinationName.trim()) {
      setDestinationNameError("Source name cannot be empty");
      return;
    }

    setDestinationNameError("");
    setIsLoading(true);

    // Add a 2-second delay
    setTimeout(async () => {
      await createNewDestination();
      setIsLoading(false);
      navigate("/destination");
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
      <PageHeader title={`Edit destination`} isPadded />
      <Box
        mr="32"
        ml="32"
        bg={`${colorMode === "dark" ? "gray.700" : "white"}`}
        borderRadius="lg"
        p="4"
        shadow="md"
      >
        <Flex borderBottom="1px solid" pb="1">
          <Box>
            <Text fontSize="md">
              Edit the form below or use the smart editor to edit the already
              configured destination connector.
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
              <Switch id="smart-editor" />
            </FormControl>
          </Box>
        </Flex>
        <Box pt="2">
          <Text fontSize="md">1. Capture details</Text>
          <Box
            bg={`${
              colorMode === "dark" ? "gray.800" : `${AppThemeGreen.Background}`
            }`}
            mt="1"
            pr="3"
            pl="3"
            pb="3"
            pt="2"
            borderRadius="lg"
          >
            <FormControl isRequired>
              <FormLabel>Destination type</FormLabel>
              <Box width="50px">
                <ConnectorImage connectorType={destination?.type ?? ""} />
              </Box>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Destination name</FormLabel>
              <Input
                type="text"
                bg={colorMode === "dark" ? "gray.700" : "white"}
                isInvalid={!!destinationNameError}
                errorBorderColor="crimson"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Detail</FormLabel>
              <Input
                type="text"
                bg={colorMode === "dark" ? "gray.700" : "white"}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
              <FormHelperText>
                Add a one liner to describe your destination or where you plan
                to capture.
              </FormHelperText>
            </FormControl>
          </Box>
        </Box>
        <Box pt="2">
          <Text fontSize="md">2. Configuration properties</Text>
          <Box
            bg={`${
              colorMode === "dark" ? "gray.800" : `${AppThemeGreen.Background}`
            }`}
            mt="1"
            pr="3"
            pl="3"
            pb="3"
            pt="2"
            borderRadius="lg"
          >
            {Array.from(properties.keys()).map((key) => (
              <Grid key={key} gap={6} templateColumns="5.5fr 5.5fr 1fr" pb="4">
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
        <Flex pt="4">
          <Box>
            <Button
              variant="outline"
              onClick={() => navigateTo("/destination")}
            >
              Back
            </Button>
          </Box>
          <Spacer />
          <Box>
            <Button
              variant="solid"
              isLoading={isLoading}
              loadingText="Create destination"
              onClick={handleCreateDestination}
            >
              Save
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default DestinationEdit;
