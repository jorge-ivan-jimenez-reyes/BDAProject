const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const WebSocket = require('ws');

// Crear instancia de express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'monitoring_db',
  password: '12345',
  port: 5432,
});

// Configurar WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });

// Cuando un cliente se conecta al WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  sendDataToClient(ws);

  // Manejar mensajes entrantes desde el cliente (opcional)
  ws.on('message', (message) => {
    console.log(`Mensaje recibido: ${message}`);
  });

  // Cuando el cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Función para obtener y enviar datos desde la base de datos al cliente
const sendDataToClient = async (ws) => {
  try {
    const serverMetricsResult = await pool.query('SELECT * FROM server_metrics ORDER BY timestamp DESC LIMIT 100');
    const uptimeMonitorResult = await pool.query('SELECT * FROM uptime_monitor ORDER BY check_time DESC LIMIT 1');
    const eventLogsResult = await pool.query("SELECT event_time, event_type, EXTRACT(HOUR FROM event_time) AS hour FROM event_logs ORDER BY event_time DESC LIMIT 100");
    const securityIncidentsResult = await pool.query("SELECT incident_type, severity, COUNT(*) AS count FROM security_incidents GROUP BY incident_type, severity");
    const incidentResolutionLogsResult = await pool.query("SELECT resolution_status, COUNT(*) AS count FROM incident_resolution_logs GROUP BY resolution_status");
    const anomalyDetectionLogsResult = await pool.query('SELECT * FROM anomaly_detection_logs ORDER BY detection_time DESC LIMIT 100');
    const predictedIncidentsResult = await pool.query('SELECT incident_type, likelihood, impact_estimate FROM predicted_incidents ORDER BY predicted_time DESC LIMIT 100');
    const historicalDataResult = await pool.query('SELECT * FROM historical_data_archive ORDER BY timestamp DESC LIMIT 100');
    const ipLocationResult = await pool.query('SELECT e.ip_address, l.country, l.latitude, l.longitude FROM event_logs e JOIN ip_to_location l ON e.ip_address = l.ip_address LIMIT 100');
    const userActivityResult = await pool.query('SELECT action_type, COUNT(*) AS count FROM user_activity GROUP BY action_type');
    const threatIntelligenceResult = await pool.query('SELECT threat_type, severity FROM threat_intelligence');
    const alertConfigurationsResult = await pool.query('SELECT * FROM alert_configurations');

    const data = {
      serverMetrics: serverMetricsResult.rows,
      uptimeMonitor: uptimeMonitorResult.rows[0],
      eventLogs: eventLogsResult.rows,
      securityIncidents: securityIncidentsResult.rows,
      incidentResolutionLogs: incidentResolutionLogsResult.rows,
      anomalyDetectionLogs: anomalyDetectionLogsResult.rows,
      predictedIncidents: predictedIncidentsResult.rows,
      historicalData: historicalDataResult.rows,
      ipLocation: ipLocationResult.rows,
      userActivity: userActivityResult.rows,
      threatIntelligence: threatIntelligenceResult.rows,
      alertConfigurations: alertConfigurationsResult.rows,
    };

    ws.send(JSON.stringify(data));
  } catch (error) {
    console.error('Error al obtener los datos desde la base de datos:', error);
  }
};

// Ruta para obtener los datos de Real-Time Monitoring y Performance Overview
app.get('/api/realTimeMonitoring', async (req, res) => {
  try {
    const serverMetricsResult = await pool.query('SELECT * FROM server_metrics ORDER BY timestamp DESC LIMIT 100');
    const uptimeMonitorResult = await pool.query('SELECT * FROM uptime_monitor ORDER BY check_time DESC LIMIT 1');
    const eventLogsResult = await pool.query("SELECT event_time, event_type, EXTRACT(HOUR FROM event_time) AS hour FROM event_logs ORDER BY event_time DESC LIMIT 100");

    res.json({
      serverMetrics: serverMetricsResult.rows,
      uptimeMonitor: uptimeMonitorResult.rows[0],
      eventLogs: eventLogsResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de Real-Time Monitoring:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Real-Time Monitoring' });
  }
});

// Ruta para Security Incident Analysis
app.get('/api/securityIncidentAnalysis', async (req, res) => {
  try {
    const securityIncidentsResult = await pool.query("SELECT incident_type, severity, COUNT(*) AS count FROM security_incidents GROUP BY incident_type, severity");
    const incidentResolutionLogsResult = await pool.query("SELECT resolution_status, COUNT(*) AS count FROM incident_resolution_logs GROUP BY resolution_status");
    const anomalyDetectionLogsResult = await pool.query('SELECT * FROM anomaly_detection_logs ORDER BY detection_time DESC LIMIT 100');

    res.json({
      securityIncidents: securityIncidentsResult.rows,
      incidentResolutionLogs: incidentResolutionLogsResult.rows,
      anomalyDetectionLogs: anomalyDetectionLogsResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de Security Incident Analysis:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Security Incident Analysis' });
  }
});

// Ruta para Predictive Analysis and Forecasts
app.get('/api/predictiveAnalysis', async (req, res) => {
  try {
    const predictedIncidentsResult = await pool.query('SELECT incident_type, likelihood, impact_estimate FROM predicted_incidents ORDER BY predicted_time DESC LIMIT 100');
    const historicalDataResult = await pool.query('SELECT * FROM historical_data_archive ORDER BY timestamp DESC LIMIT 100');

    res.json({
      predictedIncidents: predictedIncidentsResult.rows,
      historicalData: historicalDataResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de Predictive Analysis:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Predictive Analysis' });
  }
});

// Ruta para Geographical Visualization
app.get('/api/geographicalVisualization', async (req, res) => {
  try {
    const ipLocationResult = await pool.query('SELECT e.ip_address, l.country, l.latitude, l.longitude FROM event_logs e JOIN ip_to_location l ON e.ip_address = l.ip_address LIMIT 100');

    res.json({
      ipLocation: ipLocationResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de Geographical Visualization:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Geographical Visualization' });
  }
});

// Ruta para User Activity and Behavior Insights
app.get('/api/userActivityInsights', async (req, res) => {
  try {
    const userActivityResult = await pool.query('SELECT action_type, COUNT(*) AS count FROM user_activity GROUP BY action_type');

    res.json({
      userActivity: userActivityResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de User Activity Insights:', error);
    res.status(500).json({ error: 'Error al obtener los datos de User Activity Insights' });
  }
});

// Ruta para Threat Intelligence and Alerts
app.get('/api/threatIntelligence', async (req, res) => {
  try {
    const threatIntelligenceResult = await pool.query('SELECT threat_type, severity FROM threat_intelligence');
    const alertConfigurationsResult = await pool.query('SELECT * FROM alert_configurations');

    res.json({
      threatIntelligence: threatIntelligenceResult.rows,
      alertConfigurations: alertConfigurationsResult.rows,
    });
  } catch (error) {
    console.error('Error al obtener los datos de Threat Intelligence:', error);
    res.status(500).json({ error: 'Error al obtener los datos de Threat Intelligence' });
  }
});

// Definir el puerto donde correrá el servidor HTTP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor HTTP corriendo en el puerto ${PORT}`);
});
