export interface IProduct {
    [x: string]: any;
    _id:string | number,
    name:string,
    price:number,
    categoryId: string;
    desc:string,
    image:string,
    author:string,
    quanlity:number
    }