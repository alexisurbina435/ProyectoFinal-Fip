export class CreateEjercicioDto{
    id_ejercicio?: number;
    nombre: string;
    detalle: string;
    tipo?: string;
    grupo_muscular?: string;
    img_url?: string;
    video_url?: string;
}