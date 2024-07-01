/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Icon } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { MdLogout } from "react-icons/md";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import { Source, fetchData } from "../../utils/apis";
import SourceSinkTable from "../../components/SourceSinkTable";
import Toolbar from "../../components/Toolbar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { API_URL } from "../../utils/constants";
import _, { debounce } from "lodash";

const Sources: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate("/source/catalog");
  };
  const [searchResult, setSearchResult] = React.useState<Source[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onClear = () => {
    onSearch?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const {
    data: sourcesList = [],
    error,
    isLoading,
  } = useQuery<Source[], Error>(
    "sources",
    () => fetchData<Source[]>(`${API_URL}/api/sources`),
    {
      refetchInterval: 7000,
      onSuccess: (data) => {
        if (searchQuery.length > 0) {
          const filteredSource = _.filter(data, function (o) {
            return o.name.toLowerCase().includes(searchQuery.toLowerCase());
          });
          setSearchResult(filteredSource);
        } else {
          setSearchResult(data);
        }
      },
    }
  );

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const filteredSource = _.filter(sourcesList, function (o) {
        return o.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSearchResult(filteredSource);
    }, 700),
    [sourcesList]
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
      <PageHeader title="Source" isPadded={false} />
      {sourcesList.length > 0 ? (
        <Box>
          <Toolbar
            primaryAction={
              <Button leftIcon={<AddIcon />} onClick={navigateTo}>
                New source
              </Button>
            }
            searchQuery={searchQuery}
            onSearch={onSearch}
          />
          <SourceSinkTable
            data={searchQuery.length > 0 ? searchResult : sourcesList}
            tableType="source"
            onClear={onClear}
            isFiltered={searchQuery.length > 0}
          />
        </Box>
      ) : (
        <EmptyState
          icon={<Icon as={MdLogout} boxSize={20} />}
          title="No source available"
          message="No source configured for this cluster, setup a source to get started."
          action={
            <Button leftIcon={<AddIcon />} onClick={navigateTo}>
              New source
            </Button>
          }
        />
      )}
    </>
  );
};

export default Sources;
