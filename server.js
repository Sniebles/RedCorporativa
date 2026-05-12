import express from "express";
import neo4j from "neo4j-driver";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

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

            CREATE (o:Oferta {
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

// RUTA MÁS CORTA ENTRE USUARIO Y EMPRESA

app.get("/ruta/:usuario/:empresa", async (req, res) => {

    const session = driver.session();

    try {

        const { usuario, empresa } = req.params;

        const result = await session.run(
            `
            MATCH (u:Usuario {nombre: $usuario})
            MATCH (e:Empresa {nombre: $empresa})

            MATCH p = shortestPath((u)-[*..10]-(e))

            RETURN p
            `,
            { usuario, empresa },
            {
                timeout: 5000
            }
        );

        res.json(result.records);

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
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN n, r, m
            LIMIT 100
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