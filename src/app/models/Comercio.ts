import { Address } from "./Address";

export class Comercio {
    id:number;
    email:string;
    nombre:string;
    tipoComidaId:number;
    imagenLogo:string;
    estado:string;
    addressDto:Address =  new Address();
    latitud: number;
    longitud: number;
}