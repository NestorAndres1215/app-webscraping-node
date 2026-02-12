const axios = require('axios');
const cheerio = require('cheerio');
const Noticia = require('../models/noticiaModel');

const obtenerNoticiasService = async () => {
  // Petición HTTP
  const { data } = await axios.get('https://elpais.com');

  // Cargar HTML con Cheerio
  const $ = cheerio.load(data);
  const noticias = [];

  // Seleccionamos todos los titulares
  $('h2.c_t').each((i, el) => {
    const titulo = $(el).text()?.trim();
    const linkRaw = $(el).find('a').attr('href');
    const link = linkRaw ? (linkRaw.startsWith('http') ? linkRaw : `https://elpais.com${linkRaw}`) : null;

    if (titulo && link) {
      noticias.push(new Noticia(titulo, link));
    }
  });

  return noticias;
};

module.exports = { obtenerNoticiasService };
