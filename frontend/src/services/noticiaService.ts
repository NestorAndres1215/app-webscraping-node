import type { ApiResponse } from "../types/noticia";

const API_URL = "http://localhost:3000/";

export const obtenerNoticias = async (): Promise<ApiResponse> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener noticias");
  }

  return await response.json();
};