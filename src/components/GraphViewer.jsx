import React, { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 500,
    padding: 50,
    nodeRepulsion: 4500,
    idealEdgeLength: 120
};

const GraphViewer = ({ elements }) => {
    const cyRef = useRef(null);

    useEffect(() => {
        if (cyRef.current && elements.length > 0) {
            const cy = cyRef.current;

            setTimeout(() => {
            cy.resize();
            cy.layout(layout).run();
            cy.fit();
            }, 0);
        }
    }, [elements]);

    return (
        <div className="graph-container">
            <CytoscapeComponent className='graph'
                cy={(cy) => {
                    cyRef.current = cy;
                }}
                elements={elements}
                stylesheet={[
                {
                    selector: 'node',
                    style: {
                        backgroundColor: '#aa3bff',
                        label: 'data(label)',
                        color: '#fff',
                        width: 60,
                        height: 60,
                        fontSize: 12,
                        textWrap: 'wrap',
                        textValign: 'center',
                        textHalign: 'center'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        width: 2,
                        lineColor: '#666',
                        targetArrowColor: '#666',
                        targetArrowShape: 'triangle',
                        curveStyle: 'bezier',
                        label: 'data(label)'
                    }
                }
            ]}
        />
    </div>
  );
};

export default GraphViewer;