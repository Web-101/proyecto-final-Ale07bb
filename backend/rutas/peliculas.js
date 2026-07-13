const express = require('express');
const peliculas = require('../datos/peliculas.json');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(peliculas);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const pelicula = peliculas.find((item) => item.id === id);

  if (!pelicula) {
    return res.status(404).json({
      mensaje: 'Pelicula no encontrada'
    });
  }

  return res.json(pelicula);
});

module.exports = router;
