const express = require('express');
const cors = require('cors');
const peliculasRutas = require('./rutas/peliculas');

const app = express();
const PORT = process.env.PORT || 4317;

app.use(cors());
app.use(express.json());

app.use('/api/peliculas', peliculasRutas);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Backend de cartelera de cine funcionando'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
