export class TipoComida {
    id:number;
    tipo:string;

    constructor(public pId:number, public pTipo:string){
        this.id = pId;
        this.tipo = pTipo;
    }
}