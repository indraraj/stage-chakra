/* eslint-disable no-useless-escape */
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React, { FC } from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { useLocation } from "react-router-dom";

const BreadcrumbGenerator: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Breadcrumb
      spacing="8px"
      fontSize="sm"
      separator={<MdOutlineChevronRight color="gray.500" />}
    >
      {children}
    </Breadcrumb>
  );
};

const generateBreadcrumbItem = (
  url: string,
  label: string,
  isCurrent: boolean = false
) => {
  return (
    <BreadcrumbItem isCurrentPage={isCurrent}>
      <BreadcrumbLink href={url}>{label}</BreadcrumbLink>
    </BreadcrumbItem>
  );
};

const AppBreadcrumb: React.FC = () => {
  const location = useLocation();

  const appBreadcrumb = (route: string) => {
    console.log("URL:", route, route.match("//source/d+/edit"));

    switch (true) {
      case route.match("/source/catalog") !== null:
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/source", "Source")}
            {generateBreadcrumbItem("#", "Catalog", true)}
          </BreadcrumbGenerator>
        );
      case route.match("/source/[^/]+/edit") !== null:
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/source", "Source")}
            {generateBreadcrumbItem("#", "test-source-mongo", true)}
          </BreadcrumbGenerator>
        );
      case route.includes("/source/create_source"):
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/source", "Source")}
            {generateBreadcrumbItem("/source/catalog", "Catalog")}
            {generateBreadcrumbItem("#", "Create source", true)}
          </BreadcrumbGenerator>
        );
      case route === "/destination/catalog":
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/destination", "Destination")}
            {generateBreadcrumbItem("#", "Catalog", true)}
          </BreadcrumbGenerator>
        );
      case route.match("/destination/[^/]+/edit") !== null:
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/destination", "Destination")}
            {generateBreadcrumbItem("#", "test-infi", true)}
          </BreadcrumbGenerator>
        );
      case route.includes("/destination/create_destination"):
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/destination", "Destination")}
            {generateBreadcrumbItem("/destination/catalog", "Catalog")}
            {generateBreadcrumbItem("#", "Create destination", true)}
          </BreadcrumbGenerator>
        );
      case route === "/pipeline/pipeline_designer":
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem("#", "Pipeline designer", true)}
          </BreadcrumbGenerator>
        );
      case route.match("/pipeline/[^/]+/edit") !== null:
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem("#", "indra-ui-test", true)}
            {generateBreadcrumbItem("#", "Edit", true)}
          </BreadcrumbGenerator>
        );
      case route.match("/pipeline/[^/]+/overview") !== null:
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem("#", "indra-ui-test", true)}
            {generateBreadcrumbItem("#", "Overview", true)}
          </BreadcrumbGenerator>
        );
      case route === "/pipeline/pipeline_designer/configure":
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem("#", "Pipeline designer")}
            {generateBreadcrumbItem("#", "Create pipeline")}
          </BreadcrumbGenerator>
        );
      case route === "/pipeline/pipeline_designer/destination":
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem(
              "/pipeline/pipeline_designer",
              " Pipeline designer"
            )}
            {generateBreadcrumbItem("#", "Destination", true)}
          </BreadcrumbGenerator>
        );
      case route.includes(
        "/pipeline/pipeline_designer/destination/new_destination"
      ):
        return (
          <BreadcrumbGenerator>
            {generateBreadcrumbItem("/pipeline", "Pipeline")}
            {generateBreadcrumbItem(
              "/pipeline/pipeline_designer",
              "Pipeline designer"
            )}
            {generateBreadcrumbItem(
              "pipeline/pipeline_designer/destination",
              "Destination"
            )}
            {generateBreadcrumbItem("#", "Create destination", true)}
          </BreadcrumbGenerator>
        );
    }
  };
  return <>{appBreadcrumb(location.pathname)}</>;
};

export default AppBreadcrumb;
