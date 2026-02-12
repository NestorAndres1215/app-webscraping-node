const { obtenerNoticiasService } = require('../service/noticia.service');

const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await obtenerNoticiasService();
    res.render('index', { noticias });
  } catch (error) {
    console.error("❌ Error al obtener noticias:", error.message);
    res.status(500).send('Error al obtener las noticias. Intente nuevamente más tarde.');
  }
};

module.exports = { obtenerNoticias };
