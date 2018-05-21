export class CategoriaPlato {
    id:number;
    tipo:string;

    constructor(public pId:number, public pTipo:string){
        this.id = pId;
        this.tipo = pTipo;
    }
}

export class CategoriaPlatoPost {
    id:number;
    tipo:string;
    comercioId:number;

    constructor(public pId:number, public pTipo:string, public pComercioId:number){
        this.id = pId;
        this.tipo = pTipo;
        this.comercioId = pComercioId;
    }
}