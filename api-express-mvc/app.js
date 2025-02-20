const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes.js');

// Instancia el servidor
const app = express();

// Configuracion del middleware
app.use(cors());  // Evitar CORS
app.use(express.json());
app.use('/', routes);

app.listen(5000, () => {
    console.log('server is listening on port 5000');
})