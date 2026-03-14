export interface Noticia {
  id?: number;
  titulo: string;
  descripcion: string;
  link?: string;
  imagen?: string;
}

export interface ApiResponse {
  success: boolean;
  data: Noticia[];
  mensaje?: string;
}