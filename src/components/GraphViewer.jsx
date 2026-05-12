import React, { useEffect, useRef, useState } from 'react';
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

    const [edgeLabels, setEdgeLabels] = useState([]);

    useEffect(() => {

        if (cyRef.current && elements.length > 0) {

            const cy = cyRef.current;

            setTimeout(() => {

                cy.resize();

                cy.layout(layout).run();

                cy.fit();

                updateEdgeLabels();

            }, 0);
        }

    }, [elements]);

    const updateEdgeLabels = () => {

        const cy = cyRef.current;

        if (!cy) return;

        const zoom = cy.zoom();

        const labels = cy.edges().map(edge => {

            const source = edge.source().position();
            const target = edge.target().position();

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            const dx = target.x - source.x;
            const dy = target.y - source.y;

            const length = Math.sqrt(dx * dx + dy * dy);

            if (length === 0) return null;

            let angle = Math.atan2(dy, dx) * 180 / Math.PI;

            const flipped = angle > 90 || angle < -90;

            if (flipped) {
                angle += 180;
            }

            const nx = -dy / length;
            const ny = dx / length;

            const visualOffset = 0.1 * zoom + 7;

            const offset = flipped ? -visualOffset : visualOffset;

            const pan = cy.pan();

            const x = (midX + nx * offset) * zoom + pan.x;
            const y = (midY + ny * offset) * zoom + pan.y;

            return {
                id: edge.id(),
                label: edge.data('label'),
                x,
                y,
                angle,
                zoom
            };

        }).filter(Boolean);

        setEdgeLabels(labels);
    };

    useEffect(() => {

        const cy = cyRef.current;

        if (!cy) return;

        const handler = () => {
            updateEdgeLabels();
        };

        cy.on('pan zoom drag position layoutstop', handler);

        return () => {
            cy.off('pan zoom drag position layoutstop', handler);
        };

    }, []);

    return (
        <div
            className="graph-container"
            style={{
                position: 'relative'
            }}
        >
            <CytoscapeComponent
                className='graph'
                style={{
                    width: '100%',
                    height: '100%'
                }}
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
                            curveStyle: 'bezier'
                        }
                    },
                    {
                        selector: 'node[type="Usuario"]',
                        style: { backgroundColor: '#60a0db'}
                    },
                    {
                        selector: 'node[type="Empresa"]',
                        style: { backgroundColor: '#e05d9e'}
                    },
                    {
                        selector: 'node[type="Habilidad"]',
                        style: { backgroundColor: '#e0a75d'}
                    },
                    {
                        selector: 'node[type="Oferta"]',
                        style: { backgroundColor: '#2ec97c'}
                    },
                    {
                        selector: 'node[type="Proyecto"]',
                        style: { backgroundColor: '#5d66e0'}
                    }
                ]}
            />

            {edgeLabels.map(label => (
                <div
                    key={label.id}
                    style={{
                        position: 'absolute',
                        left: `${label.x}px`,
                        top: `${label.y}px`,
                        transform: `
                            translate(-50%, -50%)
                            rotate(${label.angle}deg)
                            scale(${label.zoom})
                        `,
                        transformOrigin: 'center',
                        color: '#666',
                        fontSize: '10px',
                        pointerEvents: 'none',
                        whiteSpace: 'nowrap',
                        lineHeight: 1
                    }}
                >
                    {label.label}
                </div>
            ))}
        </div>
    );
};

export default GraphViewer;