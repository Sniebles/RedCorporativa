import { useState } from 'react'
import './App.css'
import QueryPanel from './components/QueryPanel'
import GraphViewer from './components/GraphViewer'

function App() {
  const [elements, setElements] = useState([]);

  const mapToElements = (data) => {
    const nodes = new Map();
    const edges = [];

    data.forEach((item, index) => {
      if (item.origen) {
        const origenId = `${item.origen.nombre || 'node' + index}`;
        if (!nodes.has(origenId)) {
          nodes.set(origenId, {
            data: {
              id: origenId,
              label: `${Object.keys(item.origen)[0] || 'Node'}: ${item.origen.nombre || JSON.stringify(item.origen)}`
            }
          });
        }
      }

      if (item.destino) {
        const destinoId = `${item.destino.nombre || 'node' + (index + 1)}`;
        if (!nodes.has(destinoId)) {
          nodes.set(destinoId, {
            data: {
              id: destinoId,
              label: `${Object.keys(item.destino)[0] || 'Node'}: ${item.destino.nombre || JSON.stringify(item.destino)}`
            }
          });
        }

        if (item.origen && item.relacion) {
          const origenId = `${item.origen.nombre || 'node' + index}`;
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
