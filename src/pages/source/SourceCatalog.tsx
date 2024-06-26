/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { MdAddCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import sourceCatalog from "../../mocks/data/SourceCatalog.json";
import ConnectorImage from "../../components/ConnectorImage";
import SearchInput from "../../components/SearchInput";
import _, { debounce } from "lodash";

const SourceCatalog: React.FC = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const [sourceTypes, setSourceTypes] = useState<any[]>([]);
  const [searchResult, setSearchResult] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  useEffect(() => {
    setSourceTypes(sourceCatalog);
    setSearchResult(sourceCatalog);
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const filteredSource = _.filter(sourceTypes, function (o) {
        return o.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSearchResult(filteredSource);
    }, 700),
    [sourceTypes]
  );

  const onSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const onCardClick = (sourceId: string) => {
    navigate(`/source/create_source/${sourceId}`);
  };
  return (
    <>
      <PageHeader
        title="Selected the type of source you want to connect"
        isPadded
      />
      <Box pr="32" pl="32">
        <Flex pb="4">
          <SearchInput
            placeholder="Search"
            searchInput={searchQuery}
            onSearch={onSearch}
          />
          <Spacer />
          <Box>
            {searchQuery.length > 0 ? searchResult.length : sourceTypes.length}{" "}
            Connectors
          </Box>
        </Flex>
        <SimpleGrid columns={2} spacing={6}>
          {(searchQuery.length > 0 ? searchResult : sourceTypes).map(
            (sourceType) => (
              <Card
                key={sourceType.type}
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
                cursor="pointer"
                _hover={{ boxShadow: "md" }}
                onClick={() => onCardClick(sourceType.id)}
                bg={colorMode === "dark" ? "gray.700" : ""}
              >
                <Box
                  width="70px"
                  pl="4"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ConnectorImage connectorType={sourceType.type} />
                </Box>

                <Stack>
                  <CardBody>
                    <Heading size="md">{sourceType.name}</Heading>
                    <Text py="2">{sourceType.description}</Text>
                  </CardBody>
                </Stack>
              </Card>
            )
          )}
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            cursor="pointer"
            _hover={{ boxShadow: "md" }}
            bg={colorMode === "dark" ? "gray.700" : ""}
          >
            <Box
              width="70px"
              pl="4"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={MdAddCircleOutline} boxSize="12" color="green.500" />
            </Box>

            <Stack>
              <CardBody>
                <Heading size="md" color="green.500">
                  Request connector
                </Heading>
                <Text py="2">
                  Didn't find what you were looking for, request a new source
                  connector.
                </Text>
              </CardBody>
            </Stack>
          </Card>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default SourceCatalog;
