
class Noticia {
  constructor(titulo, link) {
    this.titulo = titulo;
    this.link = link;
    Object.freeze(this);
  }
}

module.exports = Noticia;
