const { obtenerNoticiasService } = require('../service/noticia.service');

const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await obtenerNoticiasService();

    if (!noticias || noticias.length === 0) {
      console.warn('⚠ No se encontraron noticias.');
      return res.render('index', { noticias: [], mensaje: 'No hay noticias disponibles por el momento.' });
    }

    res.render('index', { noticias });
  } catch (error) {
    console.error('❌ Error al obtener noticias:', error);
    res.status(500).render('index', { noticias: [], mensaje: 'Ocurrió un error al cargar las noticias. Intente nuevamente más tarde.' });
  }
};

module.exports = { obtenerNoticias };
