import { useState } from 'react'
import './App.css'
import QueryPanel from './components/QueryPanel'
import GraphViewer from './components/GraphViewer'

function App() {
  const [elements, setElements] = useState([]);
  
  const getProp = (node) => {
    const type = node.labels[0] || 'Node';
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
  const mapToElements = (data) => {
    const nodes = new Map();
    const edges = [];

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

      alert(JSON.stringify(result, null, 2));

      if (response.ok) {
        if (method === 'POST') {
          const graphResponse = await fetch('http://localhost:3000/grafo');
          const graphData = await graphResponse.json();
          const { nodes, edges } = mapToElements(graphData);
          setElements([...nodes, ...edges]);
        } else {
          if (Array.isArray(result)) {
            const { nodes, edges } = mapToElements(result);
            setElements([...nodes, ...edges]);
          }
        }
      } else {
        console.error(result.error);
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
    <div className="app-container">
      <QueryPanel onExecuteQuery={onExecuteQuery} />
      <div className="graph-area">
        <GraphViewer elements={elements} />
      </div>
    </div>
  )
}

export default App
