const { obtenerNoticiasService } = require('../service/noticia.service');

const obtenerNoticias = async (req, res) => {
  try {
    const noticias = await obtenerNoticiasService();

    if (!noticias || noticias.length === 0) {
      console.warn('⚠ No se encontraron noticias.');
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

  } catch (error) {
    console.error('❌ Error al obtener noticias:', error);

    res.status(500).json({
      success: false,
      mensaje: 'Ocurrió un error al cargar las noticias. Intente nuevamente más tarde.'
    });
  }
};

module.exports = { obtenerNoticias };