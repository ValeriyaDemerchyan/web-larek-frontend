export interface IPage {
    gallery: IGallery;
}

export interface IGallery {
    items: ICard[];
}

export interface ICard {
    category: string;
    title: string;
    image: string;
    price: number;
}

export interface IProd extends ICard {
    id: string;
    description: string;
}

export interface IOrder {
    paymethod: string;
    address: string;
}

export interface IInfo {
    email: string;
    phone: string;
}

export interface ICart extends IOrder, IInfo {
    items: IProd[];
    total: number;
}