import { AddIcon } from "@chakra-ui/icons";
import { Icon, Button, Box } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { MdSwapCalls } from "react-icons/md";
import EmptyState from "../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import PipelineTable from "../../components/PipelineTable";
import Toolbar from "../../components/Toolbar";
import { Pipeline, fetchData } from "../../utils/apis";
import { useQuery } from "react-query";
import { API_URL } from "../../utils/constants";
import _, { debounce } from "lodash";

const Pipelines: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate("/pipeline/pipeline_designer");
  };

  const [searchResult, setSearchResult] = React.useState<Pipeline[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const onClear = () => {
    onSearch?.({
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const {
    data: pipelinesList = [],
    error,
    isLoading,
  } = useQuery<Pipeline[], Error>(
    "pipelines",
    () => fetchData<Pipeline[]>(`${API_URL}/api/pipelines`),
    {
      refetchInterval: 7000,
      onSuccess: (data) => {
        if (searchQuery.length > 0) {
          const filteredPipeline = _.filter(data, function (o) {
            return o.name.toLowerCase().includes(searchQuery.toLowerCase());
          });
          setSearchResult(filteredPipeline);
        } else {
          setSearchResult(data);
        }
      },
    }
  );

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const filteredPipeline = _.filter(pipelinesList, function (o) {
        return o.name.toLowerCase().includes(searchQuery.toLowerCase());
      });

      setSearchResult(filteredPipeline);
    }, 500),
    [pipelinesList]
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
      <PageHeader title="Pipeline" isPadded={false} />
      {pipelinesList.length > 0 ? (
        <Box>
          <Toolbar
            primaryAction={
              <Button leftIcon={<AddIcon />} onClick={navigateTo}>
                New pipeline
              </Button>
            }
            searchQuery={searchQuery}
            onSearch={onSearch}
          />
          <PipelineTable
            data={searchQuery.length > 0 ? searchResult : pipelinesList}
            onClear={onClear}
            isFiltered={searchQuery.length > 0}
          />
        </Box>
      ) : (
        <EmptyState
          icon={<Icon as={MdSwapCalls} boxSize={20} />}
          title="No pipeline available"
          message="No pipeline configured for this cluster, setup a pipeline to get started."
          action={
            <Button leftIcon={<AddIcon />} onClick={navigateTo}>
              New pipeline
            </Button>
          }
        />
      )}
    </>
  );
};

export default Pipelines;
