/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  Node,
  EdgeChange,
  Edge,
  Connection,
  Background,
} from "reactflow";
import AddTransformationNode from "./AddTransformationNode";
import { useColorMode } from "@chakra-ui/react";
import DataNode from "./DataNode";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {
  addTransformation: AddTransformationNode,
  dataNode: DataNode,
};

const proOptions = { hideAttribution: true };

interface CreationFlowProps {}

const CompositionFlow: React.FC<CreationFlowProps> = () => {
  const { colorMode } = useColorMode();

  const dataSourceNode = useMemo(
    () => ({
      id: "source",
      data: {
        connectorType: "io.debezium.connector.cassandra.CassandraConnector",
        label: "test-cass",
        type: "source",
        editAction: () => {},
        compositionFlow: true,
      },
      position: { x: 100, y: 160 },
      type: "dataNode",
      draggable: false,
    }),
    []
  );

  const transformationGroup = useMemo(() => {
    return {
      id: "transformation_group",
      data: { label: "Transformation" },
      position: { x: 330, y: 120 },
      style: {
        // backgroundColor: "rgba(198,246,213, 0.2)",
        // backgroundColor: "rgba(240, 255, 244, 0.2)",
        backgroundColor: "rgba(203,213,224, 0.2)",
        width: 200,
        height: 150,
      },
      type: "group",
      draggable: false,
    };
  }, []);

  const defaultTransformationNode = useMemo(() => {
    return {
      id: "add_transformation",
      data: {
        label: "Transformation",
        sourcePosition: "right",
        targetPosition: "left",
      },
      position: { x: 40, y: 40 },
      targetPosition: "left",
      type: "addTransformation",
      parentId: "transformation_group",
      extent: "parent",
      draggable: false,
    };
  }, []);

  const dataDestinationNode = useMemo(
    () => ({
      id: "destination",
      data: {
        connectorType: "infinispan",
        label: "test-infi",
        type: "destination",
        editAction: () => {},
        compositionFlow: true,
      },
      position: { x: 650, y: 160 },
      type: "dataNode",
      draggable: false,
    }),
    []
  );

  const initialNodes = useMemo(
    () => [
      dataSourceNode,
      transformationGroup,
      defaultTransformationNode,
      dataDestinationNode,
    ],
    [
      dataSourceNode,
      transformationGroup,
      defaultTransformationNode,
      dataDestinationNode,
    ]
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: "source-add_transformation",
        source: "source",
        target: "add_transformation",
        animated: true,
        sourceHandle: "a",
      },
      {
        id: "add_transformation-destination",
        source: "add_transformation",
        target: "destination",
        animated: true,
      },
    ],
    []
  );

  const [nodes, setNodes] = useState<any>(initialNodes);
  const [edges, setEdges] = useState<any>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: Node[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds: Edge[]) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        maxZoom={1.5}
        minZoom={1.5}
        panOnDrag={false}
      >
        <Background
          style={{
            background: colorMode === "dark" ? "#1A202C" : "#F8FAF6",
            borderRadius: "5px",
          }}
          gap={15}
          color={colorMode === "dark" ? "#1A202C" : "#F8FAF6"}
        />
      </ReactFlow>
    </>
  );
};

export default CompositionFlow;
