Intalasion correcta:

Paso 1: intalar Node.js
Paso 2: instalar neo4j desktop
--setup de neo4j:
    -abrir neo4j desktop -> crear una instancia y colocar de contraseña 123456789
    -conectar intancia y ejecutar los queries:

    CREATE CONSTRAINT usuario_nombre_unico
    FOR (u:Usuario)
    REQUIRE u.nombre IS UNIQUE

    CREATE CONSTRAINT proyecto_nombre_unico
    FOR (p:Proyecto)
    REQUIRE p.nombre IS UNIQUE

    CREATE CONSTRAINT empresa_nombre_unico
    FOR (e:Empresa)
    REQUIRE e.nombre IS UNIQUE

    CREATE CONSTRAINT habilidad_nombre_unico
    FOR (h:Habilidad)
    REQUIRE h.nombre IS UNIQUE

    CREATE CONSTRAINT oferta_titulo_unico
    FOR (o:Oferta)
    REQUIRE o.titulo IS UNIQUE

Paso 3: ejecutar en el ComandPrompt lo siguiente:

npm install
npm install neo4j-driver
npm install cytoscape react-cytoscapejs
npm install react-router-dom

Paso 4:
--para correr el proyecto:
-iniciar la instancia en neo4j desktop con el boton de play
-crear 2 terminales en la carpeta del proyecto y ejecutar:

-en la terminal 1:
    npm run dev
-en la terminal 2:
    node server.js

al ejecutar npm run dev le arrojara un link: http://localhost:5173
ese es el link en donde esta el proyecto