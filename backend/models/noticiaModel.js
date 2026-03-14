
class Noticia {
  constructor(titulo, link) {
    if (!titulo || !link) {
      throw new Error('El título y el link son obligatorios para crear una noticia.');
    }

    this.titulo = titulo;
    this.link = link;

    Object.freeze(this);
  }
}

module.exports = Noticia;
