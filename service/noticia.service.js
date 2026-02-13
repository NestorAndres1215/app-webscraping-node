const axios = require('axios');
const cheerio = require('cheerio');
const Noticia = require('../models/noticiaModel');

const BASE_URL = 'https://elpais.com';

const obtenerNoticiasService = async () => {
  try {
    const { data } = await axios.get(BASE_URL, { timeout: 5000 });

    const $ = cheerio.load(data);
    const noticias = [];

    $('h2.c_t').each((i, el) => {
      const titulo = $(el).text()?.trim();
      const linkRaw = $(el).find('a').attr('href');
      const link = linkRaw ? (linkRaw.startsWith('http') ? linkRaw : `${BASE_URL}${linkRaw}`) : null;

      if (titulo && link) {
        noticias.push(new Noticia(titulo, link));
      }
    });

    if (noticias.length === 0) {
      console.warn('⚠ No se encontraron noticias en la página.');
    }

    return noticias;
  } catch (error) {
    console.error('❌ Error al obtener noticias desde el servicio:', error.message);
    throw new Error('No se pudo obtener las noticias de El País.');
  }
};

module.exports = { obtenerNoticiasService };
