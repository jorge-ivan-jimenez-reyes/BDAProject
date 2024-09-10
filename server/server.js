const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Configurar Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'monitoring_db',  // Nombre de la base de datos que creaste
  password: '12345',
  port: 5432,
});

// Ruta para obtener datos de UptimeRobot y guardarlos en PostgreSQL
app.get('/api/fetchAndSaveData', async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    // Llamada a la API de UptimeRobot
    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: 'm797654455-f0ab451f0cd8f2c93be813a7', // Tu API Key de UptimeRobot
        format: 'json',
      }),
    });

    const data = await response.json();

    if (data.monitors && data.monitors.length > 0) {
      const monitor = data.monitors[0];  // Tomar el primer monitor de la lista

      // Configurar los datos para insertar en PostgreSQL
      const ip_address = 'IP_DE_EJEMPLO';  // Puedes cambiar este valor si es necesario
      const request_url = monitor.url;
      const response_time = 0;  // UptimeRobot no devuelve tiempo de respuesta en esta API
      const status_code = monitor.status === 2 ? 200 : 500;  // 2 es "Online", otro valor es error

      // Insertar los datos en PostgreSQL
      await pool.query(
        'INSERT INTO network_traffic (ip_address, request_url, response_time, status_code, bytes_sent, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
        [ip_address, request_url, response_time, status_code, 0, 'UptimeRobot API']
      );

      res.status(201).json({ message: 'Datos guardados correctamente en la base de datos' });
    } else {
      res.status(400).json({ error: 'No se encontraron monitores en la respuesta' });
    }
  } catch (error) {
    console.error('Error al obtener o guardar los datos:', error);
    res.status(500).json({ error: 'Error al obtener o guardar los datos' });
  }
});

// Puerto donde correrá el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
