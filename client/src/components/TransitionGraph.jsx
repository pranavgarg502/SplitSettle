import React from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
const colors = ['#60A5FA', '#F472B6', '#34D399', '#FBBF24', '#A78BFA', '#F87171'];

function generateLayout(settlements) {
  const nodesMap = new Map();
  let angle = 0;
  const radius = 200;
    const centerX = 300;
    const centerY = 200;


  const uniquePeople = new Set();
  settlements.forEach(({ from, to }) => {
    uniquePeople.add(from);
    uniquePeople.add(to);
  });


  const nodes = Array.from(uniquePeople).map((name, index, arr) => {
    const x = centerX + radius * Math.cos((2 * Math.PI * index) / arr.length);
    const y = centerY + radius * Math.sin((2 * Math.PI * index) / arr.length);
    nodesMap.set(name, { id: name, position: { x, y } });
    return {
      id: name,
      data: { label: name },
      position: { x, y },
      draggable : true,
      style: {
        background: colors[index % colors.length],
        color: 'white',
        padding: 10,
        borderRadius: '8px',
        fontWeight: 'bold',
      },
    };
  });

  const edges = settlements.map((s, i) => ({
    id: `e${s.from}-${s.to}-${i}`,
    source: s.from,
    target: s.to,
    label: `₹${s.amount}`,
    style: { strokeWidth: 2 ,
        stroke: '#1f2937',
    },
    sourcePosition: 'right',
    targetPosition: 'left',
    labelStyle: { fill: '#000', fontWeight: 900 },
    markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#111827' 
    },
  }));

  return { nodes, edges };
}

const SettlementGraph = ({ settlements }) => {
  const { nodes, edges } = generateLayout(settlements || []);

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={true} elementsSelectable={true} panOnDrag={true}zoomOnScroll={true} >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default SettlementGraph;
