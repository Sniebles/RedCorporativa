import { useState } from 'react'
import './App.css'
import QueryPanel from './components/QueryPanel'
import GraphViewer from './components/GraphViewer'
import TableViewer from './components/TableViewer'

function App() {
  const [elements, setElements] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [displayMode, setDisplayMode] = useState('graph');
  const [tableData, setTableData] = useState([]);
  
  const getProp = (node) => {
    const type = node.labels?.[0] || 'Node';
    let name;
    switch (type) {
      case 'Oferta':
        name = node.properties.titulo
        break;
      default:
        name = node.properties.nombre || JSON.stringify(node.properties)
    }

    return {type, name}
  }

  const isListData = (data) => {
    return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && !data[0].nodes && !data[0].edges && !data[0].origen && !data[0].destino;
  };

  const getNodeId = (node, index) => {
    return node.id || node.properties?.nombre || `node-${index}`;
  };

  const mapToElements = (data) => {
    const nodes = new Map();
    const edges = [];

    const addNode = (node, index) => {
      if (!node) return;
      const nodeId = getNodeId(node, index);
      const { type, name } = getProp(node);

      if (!nodes.has(nodeId)) {
        nodes.set(nodeId, {
          data: {
            id: nodeId,
            label: `${type || 'Node'}:\n ${name}`,
            type: type
          }
        });
      }
    };

    const addEdge = (edge) => {
      if (!edge || !edge.source || !edge.target) return;
      edges.push({
        data: {
          source: edge.source,
          target: edge.target,
          label: edge.type || edge.label
        }
      });
    };

    if (Array.isArray(data) && data.length > 0 && data[0].nodes && data[0].edges) {
      data.forEach((item) => {
        item.nodes?.forEach(addNode);
        item.edges?.forEach(addEdge);
      });
      return { nodes: Array.from(nodes.values()), edges };
    }

    if (data?.nodes && data?.edges) {
      data.nodes.forEach(addNode);
      data.edges.forEach(addEdge);
      return { nodes: Array.from(nodes.values()), edges };
    }

    data.forEach((item, index) => {
      if (item.origen) {
        const origenId = `${item.origen.properties.nombre || 'node' + index}`;
        const {type, name} = getProp(item.origen)
        if (!nodes.has(origenId)) {
          nodes.set(origenId, {
            data: {
              id: origenId,
              label: `${type || 'Node'}:\n ${name}`,
              type: type
            }
          });
        }
      }

      if (item.destino) {
        const destinoId = `${item.destino.properties.nombre || 'node' + (index + 1)}`;
        const {type, name} = getProp(item.destino)
        if (!nodes.has(destinoId)) {
          nodes.set(destinoId, {
            data: {
              id: destinoId,
              label: `${type || 'Node'}:\n ${name}`,
              type: type
            }
          });
        }

        if (item.origen && item.relacion) {
          const origenId = `${item.origen.properties.nombre || 'node' + index}`;
          edges.push({
            data: {
              source: origenId,
              target: destinoId,
              label: item.relacion
            }
          });
        }
      }
    });

    return { nodes: Array.from(nodes.values()), edges };
  };

  const onExecuteQuery = async (endpoint, data, method) => {
    try {
      const url = `http://localhost:3000${endpoint}`;
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify(data) : undefined
      };

      const response = await fetch(url, options);
      const result = await response.json();
      setQueryResult(result);

      if (response.ok) {
        if (isListData(result)) {
          setDisplayMode('table');
          setTableData(result);
        } else {
          setDisplayMode('graph');
          const { nodes, edges } = mapToElements(result);
          setElements([...nodes, ...edges]);
        }

        if (method === 'POST') {
          // For POST requests, fetch and display the full graph
          const graphResponse = await fetch('http://localhost:3000/grafo');
          const graphData = await graphResponse.json();
          const { nodes, edges } = mapToElements(graphData);
          setElements([...nodes, ...edges]);
          setDisplayMode('graph');
        }
      } else {
        console.error(result.error);
        alert(`Error: ${result.error || 'Ocurrió un error'}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className='app-scroll'>
      <div className="app-container">
        <QueryPanel onExecuteQuery={onExecuteQuery} />
        <div className="graph-area">
          {displayMode === 'graph' ? (
            <GraphViewer elements={elements} />
          ) : (
            <TableViewer data={tableData} />
          )}
        </div>
      </div>
      {window.location.pathname === '/debugging' && (
        <div className="query-result">
          <h2>Resultado</h2>
          <pre>{queryResult ? JSON.stringify(queryResult, null, 2) : 'Sin resultados aún'}</pre>
        </div>
      )}
    </div>
  )
}

export default App
