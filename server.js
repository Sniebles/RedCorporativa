import express from "express";
import neo4j from "neo4j-driver";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const serializeNode = (node) => ({
    id: node.identity ? node.identity.toString() : `${node.labels?.[0] || 'Node'}-${JSON.stringify(node.properties)}`,
    labels: node.labels,
    properties: node.properties
});

const serializeRelationship = (rel) => ({
    id: rel.identity ? rel.identity.toString() : `${rel.type}-${rel.start?.toString?.() || ''}-${rel.end?.toString?.() || ''}`,
    type: rel.type,
    source: rel.start?.toString?.() || null,
    target: rel.end?.toString?.() || null,
    properties: rel.properties
});

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", "123456789")
);

// REGISTRAR USUARIO :)

app.post("/usuarios", async (req, res) => {

    const session = driver.session();

    try {

        const { nombre, profesion, experiencia } = req.body;

        await session.run(
            `
            CREATE (u:Usuario {
                nombre: $nombre,
                profesion: $profesion,
                experiencia: $experiencia
            })
            `,
            { nombre, profesion, experiencia }
        );

        res.json({
            mensaje: "Usuario registrado"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// REGISTRAR EMPRESA

app.post("/empresas", async (req, res) => {

    const session = driver.session();

    try {

        const { nombre, sector } = req.body;

        await session.run(
            `
            CREATE (e:Empresa {
                nombre: $nombre,
                sector: $sector
            })
            `,
            { nombre, sector }
        );

        res.json({
            mensaje: "Empresa registrada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// REGISTRAR HABILIDAD

app.post("/habilidades", async (req, res) => {

    const session = driver.session();

    try {

        const { nombre } = req.body;

        await session.run(
            `
            MERGE (h:Habilidad {
                nombre: $nombre
            })
            `,
            { nombre }
        );

        res.json({
            mensaje: "Habilidad registrada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// RELACIONAR USUARIO CON HABILIDAD

app.post("/usuarios/habilidad", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario, habilidad } = req.body;

        await session.run(
            `
            MATCH (u:Usuario {nombre: $usuario})
            MATCH (h:Habilidad {nombre: $habilidad})

            MERGE (u)-[:TIENE_HABILIDAD]->(h)
            `,
            { usuario, habilidad }
        );

        res.json({
            mensaje: "Relación creada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// CONECTAR USUARIOS

app.post("/usuarios/conexion", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario1, usuario2 } = req.body;

        await session.run(
            `
            MATCH (u1:Usuario {nombre: $usuario1})
            MATCH (u2:Usuario {nombre: $usuario2})

            MERGE (u1)-[:CONECTA_CON]-(u2)
            `,
            { usuario1, usuario2 }
        );

        res.json({
            mensaje: "Usuarios conectados"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// USUARIO TRABAJA EN EMPRESA

app.post("/usuarios/trabaja", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario, empresa } = req.body;

        await session.run(
            `
            MATCH (u:Usuario {nombre: $usuario})
            MATCH (e:Empresa {nombre: $empresa})

            MERGE (u)-[:TRABAJA_EN]->(e)
            `,
            { usuario, empresa }
        );

        res.json({
            mensaje: "Relación creada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// REGISTRAR OFERTA LABORAL

app.post("/ofertas", async (req, res) => {

    const session = driver.session();

    try {

        const { titulo, empresa } = req.body;

        await session.run(
            `
            MATCH (e:Empresa {nombre: $empresa})

            MERGE (o:Oferta {
                titulo: $titulo
            })

            MERGE (e)-[:PUBLICA]->(o)
            `,
            { titulo, empresa }
        );

        res.json({
            mensaje: "Oferta registrada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// OFERTA REQUIERE HABILIDAD

app.post("/ofertas/habilidad", async (req, res) => {

    const session = driver.session();

    try {

        const { oferta, habilidad } = req.body;

        await session.run(
            `
            MATCH (o:Oferta {titulo: $oferta})
            MATCH (h:Habilidad {nombre: $habilidad})

            MERGE (o)-[:REQUIERE]->(h)
            `,
            { oferta, habilidad }
        );

        res.json({
            mensaje: "Relación creada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// REGISTRAR PROYECTO

app.post("/proyectos", async (req, res) => {

    const session = driver.session();

    try {

        const { nombre, descripcion } = req.body;

        await session.run(
            `
            CREATE (p:Proyecto {
                nombre: $nombre,
                descripcion: $descripcion
            })
            `,
            { nombre, descripcion }
        );

        res.json({
            mensaje: "Proyecto registrado"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// USUARIO PARTICIPA EN PROYECTO

app.post("/usuarios/proyecto", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario, proyecto } = req.body;

        await session.run(
            `
            MATCH (u:Usuario {nombre: $usuario})
            MATCH (p:Proyecto {nombre: $proyecto})

            MERGE (u)-[:PARTICIPA_EN]->(p)
            `,
            { usuario, proyecto }
        );

        res.json({
            mensaje: "Relación creada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// PROYECTO USA HABILIDAD

app.post("/proyectos/habilidad", async (req, res) => {

    const session = driver.session();

    try {

        const { proyecto, habilidad } = req.body;

        await session.run(
            `
            MATCH (p:Proyecto {nombre: $proyecto})
            MATCH (h:Habilidad {nombre: $habilidad})

            MERGE (p)-[:USA]->(h)
            `,
            { proyecto, habilidad }
        );

        res.json({
            mensaje: "Relación creada"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// USUARIOS CON HABILIDADES SIMILARES

app.get("/usuarios/similares/:nombre", async (req, res) => {

    const session = driver.session();

    try {

        const nombre = req.params.nombre;

        const result = await session.run(
            `
            MATCH (u1:Usuario {nombre: $nombre})
                  -[:TIENE_HABILIDAD]->(h)<-
                  [:TIENE_HABILIDAD]-(u2:Usuario)

            WHERE u1 <> u2

            RETURN u2.nombre AS usuario,
                   collect(h.nombre) AS habilidades
            `,
            { nombre }
        );

        res.json(
            result.records.map(record => ({
                usuario: record.get("usuario"),
                habilidades: record.get("habilidades")
            }))
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// CONTACTOS EN COMUN

app.get("/usuarios/contactos/:usuario1/:usuario2", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario1, usuario2 } = req.params;

        const result = await session.run(
            `
            MATCH (u1:Usuario {nombre: $usuario1})-[:CONECTA_CON]-(comun)-[:CONECTA_CON]-(u2:Usuario {nombre: $usuario2})

            WHERE u1 <> comun AND u2 <> comun

            RETURN DISTINCT comun.nombre AS contacto
            `,
            { usuario1, usuario2 }
        );

        res.json(
            result.records.map(record => ({
                contacto: record.get("contacto")
            }))
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// RECOMENDACION DE USUARIO PARA OFERTA SEGUN HABILIDAD Y CONEXIONES

app.get("/ofertas/recomendados/conexiones/:oferta", async (req, res) => {

    const session = driver.session();

    try {

        const { oferta } = req.params;

        const result = await session.run(
            `
            MATCH (o:Oferta {titulo: $oferta})-[:REQUIERE]->(h:Habilidad)

            MATCH (u:Usuario)-[:TIENE_HABILIDAD]->(h)

            OPTIONAL MATCH (u)-[:CONECTA_CON]-(c)

            RETURN u.nombre AS usuario,
                   count(DISTINCT h) AS habilidadesCoincidentes,
                   count(DISTINCT c) AS conexiones,
                   collect(DISTINCT h.nombre) AS habilidades
            ORDER BY habilidadesCoincidentes DESC, conexiones DESC
            `,
            { oferta }
        );

        res.json(
            result.records.map(record => ({
                usuario: record.get("usuario"),
                habilidadesCoincidentes: record.get("habilidadesCoincidentes").toNumber(),
                conexiones: record.get("conexiones").toNumber(),
                habilidades: record.get("habilidades")
            }))
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// PROYECTOS RELACIONADOS

app.get("/proyectos/relacionados/:proyecto", async (req, res) => {

    const session = driver.session();

    try {

        const { proyecto } = req.params;

        const result = await session.run(
            `
            MATCH (p1:Proyecto {nombre: $proyecto})

            MATCH (p2:Proyecto)

            WHERE p1 <> p2

            OPTIONAL MATCH (p1)-[:USA]->(h:Habilidad)<-[:USA]-(p2)

            OPTIONAL MATCH (p1)<-[:PARTICIPA_EN]-(u:Usuario)-[:PARTICIPA_EN]->(p2)

            WITH p2,
                 collect(DISTINCT h.nombre) AS habilidades,
                 collect(DISTINCT u.nombre) AS miembros

            WHERE size(habilidades) > 0
               OR size(miembros) > 0

            RETURN p2.nombre AS proyecto,

                   habilidades,

                   miembros,

                   size(habilidades) +
                   size(miembros) AS similitud

            ORDER BY similitud DESC
            `,
            { proyecto }
        );

        res.json(
            result.records.map(record => ({
                proyecto: record.get("proyecto"),
                habilidades: record.get("habilidades"),
                miembros: record.get("miembros"),
                similitud: record.get("similitud").toNumber()
            }))
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// RUTA MÁS CORTA ENTRE 2 NODOS

app.get("/ruta/:nodo1/:nodo2", async (req, res) => {

    const session = driver.session();

    try {

        const { nodo1, nodo2 } = req.params;

        // Separar label y valor
        const [label1, value1] = nodo1.split(":");
        const [label2, value2] = nodo2.split(":");

        // Oferta usa titulo, el resto usa nombre
        const prop1 = label1 === "Oferta" ? "titulo" : "nombre";
        const prop2 = label2 === "Oferta" ? "titulo" : "nombre";

        const query = `
            MATCH (a:${label1})
            WHERE a.${prop1} = $value1

            MATCH (b:${label2})
            WHERE b.${prop2} = $value2

            MATCH p = shortestPath((a)-[*..10]-(b))

            RETURN p
        `;

        const result = await session.run(
            query,
            {
                value1,
                value2
            },
            {
                timeout: 5000
            }
        );

        const data = result.records.map(record => {

            const path = record.get("p");

            if (!path) {
                return {
                    nodes: [],
                    edges: []
                };
            }

            const nodesMap = new Map();
            const edges = [];

            path.segments.forEach(segment => {

                const startNode = serializeNode(segment.start);
                const endNode = serializeNode(segment.end);

                nodesMap.set(startNode.id, startNode);
                nodesMap.set(endNode.id, endNode);

                edges.push(
                    serializeRelationship(segment.relationship)
                );

            });

            return {
                nodes: Array.from(nodesMap.values()),
                edges
            };

        });

        res.json(data);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

// MOSTRAR TODO EL GRAFO

app.get("/grafo", async (req, res) => {

    const session = driver.session();

    try {

        const result = await session.run(
            `
            MATCH (n)-[r]->(m)
            RETURN DISTINCT n, r, m

            UNION

            MATCH (n)
            WHERE NOT (n)--()
            RETURN n, null AS r, null AS m
            `
        );

        const datos = result.records.map(record => ({

            origen: record.get("n") ? {
                labels: record.get("n").labels,
                properties: record.get("n").properties
            } : null,

            relacion: record.get("r") ? record.get("r").type : null,

            destino: record.get("m") ? {
                labels: record.get("m").labels,
                properties: record.get("m").properties
            } : null

        }));

        res.json(datos);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    } finally {

        await session.close();

    }

});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en puerto 3000");
});