const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a PostgreSQL
const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'nombre_de_tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

// Ruta de ejemplo para obtener datos de la red
app.get('/api/network', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM traffic_data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Error al obtener los datos de la red' });
  }
});

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
