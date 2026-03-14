const { obtenerNoticiasService } = require('../service/noticia.service');

const obtenerNoticias = async (req, res) => {

  const noticias = await obtenerNoticiasService();

  if (!noticias || noticias.length === 0) {

    return res.json({
      success: false,
      mensaje: 'No hay noticias disponibles por el momento.',
      data: []
    });
  }

  res.json({
    success: true,
    data: noticias
  });


};

module.exports = { obtenerNoticias };