const express = require('express');  
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Crear instancia de express
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

// Definir la ruta para obtener datos de UptimeRobot y guardarlos en PostgreSQL
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

      // 1. Insertar en network_traffic
      await pool.query(
        'INSERT INTO network_traffic (ip_address, request_url, response_time, status_code, bytes_sent, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
        [ip_address, request_url, response_time, status_code, 0, 'UptimeRobot API']
      );

      // 2. Insertar en event_logs
      await pool.query(
        'INSERT INTO event_logs (event_time, event_type, description, ip_address, related_url) VALUES ($1, $2, $3, $4, $5)',
        [new Date(), 'API Call', 'Llamada a UptimeRobot realizada', ip_address, request_url]
      );

      // 3. Insertar en security_incidents si el status_code no es 200
      if (status_code !== 200) {
        await pool.query(
          'INSERT INTO security_incidents (incident_time, ip_address, incident_type, description, severity, resolution_status) VALUES ($1, $2, $3, $4, $5, $6)',
          [new Date(), ip_address, 'Offline', `El sitio ${request_url} está fuera de línea`, 'Alto', 'Detectado']
        );
      }

      // 4. Insertar en uptime_monitor
      await pool.query(
        'INSERT INTO uptime_monitor (check_time, is_online, response_time, status_code, error_message) VALUES ($1, $2, $3, $4, $5)',
        [new Date(), status_code === 200, response_time, status_code, status_code === 200 ? null : 'Página fuera de línea']
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

// Endpoint para obtener datos del dashboard
app.get('/api/getDashboardData', async (req, res) => {
  try {
    // Consultar datos de network_traffic
    const networkTrafficResult = await pool.query('SELECT * FROM network_traffic');
    const eventLogsResult = await pool.query('SELECT * FROM event_logs');
    const uptimeMonitorResult = await pool.query('SELECT * FROM uptime_monitor');

    // Enviar la respuesta con los datos de las tablas
    res.json({
      networkTraffic: networkTrafficResult.rows,
      eventLogs: eventLogsResult.rows,
      uptimeMonitor: uptimeMonitorResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
  }
});

// Definir el puerto donde correrá el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
