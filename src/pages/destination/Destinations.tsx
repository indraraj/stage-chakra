import { AddIcon } from "@chakra-ui/icons";
import { Button, Box, Icon } from "@chakra-ui/react";
import React, { useCallback } from "react";
import Toolbar from "../../components/Toolbar";
import { useNavigate } from "react-router-dom";
import { Destination, fetchData } from "../../utils/apis";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { MdLogin } from "react-icons/md";
import SourceSinkTable from "../../components/SourceSinkTable";
import { useQuery } from "react-query";
import { API_URL } from "../../utils/constants";
import _, { debounce } from "lodash";

const Destinations: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate("/destination/catalog");
  };

  const [searchResult, setSearchResult] = React.useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onClear = () => {
    onSearch?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const {
    data: destinationsList = [],
    error,
    isLoading,
  } = useQuery<Destination[], Error>(
    "destinations",
    () => fetchData<Destination[]>(`${API_URL}/api/destinations`),
    {
      refetchInterval: 7000,
      onSuccess: (data) => {
        if (searchQuery.length > 0) {
          const filteredDestination = _.filter(data, function (o) {
            return o.name.toLowerCase().includes(searchQuery.toLowerCase());
          });
          setSearchResult(filteredDestination);
        } else {
          setSearchResult(data);
        }
      },
    }
  );

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const filteredDestination = _.filter(destinationsList, function (o) {
        return o.name.toLowerCase().includes(searchQuery.toLowerCase());
      });

      setSearchResult(filteredDestination);
    }, 500),
    [destinationsList]
  );

  const onSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <PageHeader title="Destination" isPadded={false} />
      {destinationsList.length > 0 ? (
        <Box>
          <Toolbar
            primaryAction={
              <Button leftIcon={<AddIcon />} onClick={navigateTo}>
                New destination
              </Button>
            }
            searchQuery={searchQuery}
            onSearch={onSearch}
          />

          <SourceSinkTable
            data={searchQuery.length > 0 ? searchResult : destinationsList}
            tableType="destination"
            onClear={onClear}
            isFiltered={searchQuery.length > 0}
          />
        </Box>
      ) : (
        <EmptyState
          icon={<Icon as={MdLogin} boxSize={20} />}
          title="No destination available"
          message="No destination configured for this cluster, setup a destination to get started."
          action={
            <Button leftIcon={<AddIcon />} onClick={navigateTo}>
              New destination
            </Button>
          }
        />
      )}
    </>
  );
};

export default Destinations;
