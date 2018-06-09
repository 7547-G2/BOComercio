import { Address } from "./Address";
    

export class Comercio {
    id:number;
    desuento:number;
    email:string;
    nombre:string;
    tipoComidaId:number;
    imagenLogo:string;
    imagenComercio:string;
    estado:string;
    addressDto:Address =  new Address();
    latitud: number;
    longitud: number;
    nombreEncargado: string;
    dniEncargado: number;
    telefonoEncargado: number;
}