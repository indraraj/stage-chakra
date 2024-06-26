import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";
import { MdOutlineChevronRight } from "react-icons/md";
import { useLocation } from "react-router-dom";

const AppBreadcrumb: React.FC = () => {
  const location = useLocation();

  const appBreadcrumb = (route: string) => {
    switch (true) {
      case route === "/source/catalog":
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/source">Source</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route.includes("/source/create_source"):
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/source">Source</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/source/catalog">Catalog</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Create source</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route === "/destination/catalog":
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/destination">Destination</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Catalog</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route.includes("/destination/create_destination"):
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/destination">Destination</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/destination/catalog">
                Catalog
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Create Destination</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route === "/pipeline/pipeline_designer":
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline">Pipeline</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Pipeline designer</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route === "/pipeline/pipeline_designer/configure":
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline">Pipeline</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="#">Pipeline designer</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Create pipeline</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route === "/pipeline/pipeline_designer/destination":
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline">Pipeline</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline/pipeline_designer">
                Pipeline designer
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Destination</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
      case route.includes(
        "/pipeline/pipeline_designer/destination/new_destination"
      ):
        return (
          <Breadcrumb
            spacing="8px"
            fontSize="sm"
            separator={<MdOutlineChevronRight color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline">Pipeline</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline/pipeline_designer">
                Pipeline designer
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/pipeline/pipeline_designer/destination">
                Destination
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#">Create destination</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        );
    }
  };
  return <>{appBreadcrumb(location.pathname)}</>;
};

export default AppBreadcrumb;
