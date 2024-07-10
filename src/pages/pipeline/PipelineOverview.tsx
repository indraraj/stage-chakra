/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Flex,
  useColorMode,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../utils/constants";
import PageHeader from "../../components/PageHeader";

import { useNavigate, useParams } from "react-router-dom";
import {
  Destination,
  Pipeline,
  Source,
  fetchDataTypeTwo,
} from "../../utils/apis";
import CompositionFlow from "../../components/dataFlow/CompositionFlow";

const PipelineOverview: React.FC = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const { pipelineId } = useParams<{ pipelineId: string }>();
  console.log(pipelineId);

  const [isSmartEditor, setIsSmartEditor] = useState(false);

  const [pipeline, setPipeline] = useState<Pipeline>();
  const [source, setSource] = useState<Source>();
  const [destination, setDestination] = useState<Destination>();
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pipelineName, setPipelineName] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [pipelineNameError, setPipelineNameError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [logLevel, setLogLevel] = useState<string>("");
  const [logLevelError, setLogLevelError] = useState<string>("");

  // const { source, destination } = useData();

  // useEffect(() => {
  //   const fetchPipelines = async () => {
  //     setIsFetchLoading(true);
  //     const response = await fetchDataTypeTwo<Pipeline>(
  //       `${API_URL}/api/pipelines/${pipelineId}`
  //     );

  //     if (response.error) {
  //       setError(response.error);
  //     } else {
  //       setPipeline(response.data);
  //     }

  //     setIsFetchLoading(false);
  //   };

  //   fetchPipelines();
  // }, [pipelineId]);

  useEffect(() => {
    const fetchPipelines = async () => {
      setIsFetchLoading(true);
      const response = await fetchDataTypeTwo<Pipeline>(
        `${API_URL}/api/pipelines/${pipelineId}`
      );

      if (response.error) {
        setError(response.error);
        setIsFetchLoading(false);
      } else {
        setPipeline(response.data);
        setPipelineName(response.data?.name ?? "");
        // Fetch source and destination after pipeline data is successfully fetched
        try {
          const [sourceResponse, destinationResponse] = await Promise.all([
            fetchDataTypeTwo<Source>(
              `${API_URL}/api/sources/${response?.data?.source.id}`
            ),
            fetchDataTypeTwo<Destination>(
              `${API_URL}/api/destinations/${response?.data?.destination.id}`
            ),
          ]);

          if (sourceResponse.error) {
            setError(sourceResponse.error);
          } else {
            setSource(sourceResponse.data);
          }

          if (destinationResponse.error) {
            setError(destinationResponse.error);
          } else {
            setDestination(destinationResponse.data);
          }
        } catch (fetchError) {
          setError((fetchError as Error).message);
        }

        setIsFetchLoading(false);
      }
    };
    fetchPipelines();
  }, [pipelineId]);

  console.log(
    "Pipeline:",
    pipeline,
    "Source:",
    source,
    "Destination:",
    destination
  );
  return (
    <>
      <PageHeader title="indra-ui-test" />

      <Flex mb="2">
        <Card variant="elevated" w="30%" mr="2">
          <CardHeader>
            <Heading size="sm">Queue usage</Heading>
          </CardHeader>
          <CardBody>
            <Box height="200px">
              <Center h="100%">Coming soon!</Center>
            </Box>
          </CardBody>
        </Card>
        <Card variant="elevated" w="70%" mr="2">
          <CardHeader>
            <Heading size="sm">Events</Heading>
          </CardHeader>
          <CardBody>
            <Box height="200px">
              <Center h="100%">Coming soon!</Center>
            </Box>
          </CardBody>
        </Card>
        {/* <Card variant="elevated" ml="2" flex="1">
          <CardHeader>
            <Heading size="sm">Log level</Heading>
          </CardHeader>
          <CardBody>
            <Box height="170px">
              <Center h="100%">Coming soon!</Center>
            </Box>
          </CardBody>
        </Card> */}
      </Flex>
      {/* <Flex mt="4"> */}
      <Card variant="elevated" mt="4">
        <CardBody>
          <Tabs isFitted>
            <TabList mb="1em">
              <Tab>
                <Heading size="xs">Composition</Heading>
              </Tab>
              <Tab>
                <Heading size="xs">Logs</Heading>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Box m="2" height="430px">
                  <CompositionFlow />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box m="2" height="450px">
                  <p>Coming soon!</p>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
      {/* </Flex> */}
    </>
  );
};

export default PipelineOverview;
