/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Home from "./pages/home/Home";
import { AppBranding } from "./utils/constants";
import Sources from "./pages/source/Sources";
import Destinations from "./pages/destination/Destinations";
import Pipelines from "./pages/pipeline/Pipelines";
import {
  MdLogin,
  MdLogout,
  MdOutlineHome,
  MdOutlineVpnKey,
  MdSwapCalls,
} from "react-icons/md";
import Vaults from "./pages/vaults/Vaults";
import SourceCatalog from "./pages/source/SourceCatalog";
import CreateSource from "./pages/source/CreateSource";
import DestinationCatalog from "./pages/destination/DestinationCatalog";
import CreateDestination from "./pages/destination/CreateDestination";
import PipelineDesigner from "./pages/pipeline/PipelineDesigner";
import CreateVault from "./pages/vaults/CreateVault";
import ConfigurePipeline from "./pages/pipeline/ConfigurePipeline";

export interface IAppRoute {
  label: string;
  component: React.ComponentType<any>;
  path: string;
  title: string;
  isMain?: boolean;
  isSubPath?: boolean;
  icon?: React.ComponentType<any>;
}

export type AppRouteConfig = IAppRoute;

const routes: AppRouteConfig[] = [
  {
    component: Home,
    label: "Home",
    path: "/",
    title: `${AppBranding} | Home`,
    isMain: true,
    icon: MdOutlineHome,
  },

  {
    component: Sources,
    label: "Source",
    path: "/source",
    title: `${AppBranding} | Source`,
    isMain: true,
    icon: MdLogout,
  },
  {
    component: SourceCatalog,
    label: "Source catalog",
    path: "/source/catalog",
    title: `${AppBranding} | Source`,
    isSubPath: true,
    icon: MdLogout,
  },
  {
    component: CreateSource,
    label: "Create source",
    path: "/source/create_source/:sourceId",
    title: `${AppBranding} | Source`,
    isSubPath: true,
    icon: MdLogout,
  },
  {
    component: Destinations,
    label: "Destination",
    path: "/destination",
    title: `${AppBranding} | Destination`,
    isMain: true,
    icon: MdLogin,
  },
  {
    component: DestinationCatalog,
    label: "Destination catalog",
    path: "/destination/catalog",
    title: `${AppBranding} | Destination`,
    isSubPath: true,
    icon: MdLogin,
  },
  {
    component: CreateDestination,
    label: "Create destination",
    path: "/destination/create_destination/:destinationId",
    title: `${AppBranding} | Destination`,
    isSubPath: true,
    icon: MdLogin,
  },
  {
    component: Vaults,
    label: "Vaults",
    path: "/vault",
    title: `${AppBranding} | Vaults`,
    isMain: true,
    icon: MdOutlineVpnKey,
  },
  {
    component: CreateVault,
    label: "Create Vault",
    path: "/vaults/create_vault",
    title: `${AppBranding} | Vaults`,
    isSubPath: true,
    icon: MdOutlineVpnKey,
  },
  {
    component: Pipelines,
    label: "Pipeline",
    path: "/pipeline",
    title: `${AppBranding} | Pipeline`,
    isMain: true,
    icon: MdSwapCalls,
  },
  {
    component: PipelineDesigner,
    label: "Pipeline designer",
    path: "/pipeline/pipeline_designer",
    title: `${AppBranding} | Pipeline`,
    isSubPath: true,
    icon: MdSwapCalls,
  },
  {
    component: ConfigurePipeline,
    label: "Create Pipeline",
    path: "/pipeline/pipeline_designer/configure",
    title: `${AppBranding} | Pipeline`,
    isSubPath: true,
    icon: MdSwapCalls,
  },
  // Hide setting page for now
  // {
  //   component: Setting,
  //   label: "Setting",
  //   path: "/setting",
  //   title: `${AppBranding} | Setting`,
  //   isMain: false,
  //   icon: MdOutlineSettings,
  // },
];

export { routes };
