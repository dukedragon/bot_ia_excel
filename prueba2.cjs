const express = require('express');
const app = express();

app.get('/prueba', (req, res) => {
  console.log("entrada de")
  res.send('Hola Mundo con Express.js');
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
