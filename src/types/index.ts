export interface IPage {
    gallery: HTMLElement[];
}

export interface IGallery {
    items: ICard[];
}

export interface ICard {
    category: string;
    id: string;
    title: string;
    description?: string;
    image: string;
    price: number;
}

export interface IOrder {
    paymethod: string;
    address: string;
    total: number;
    items: string[];
}

export interface IInfo {
    email: string;
    phone: string;
}

export interface ICart {
    items: HTMLElement[];
    total: number;
    selected: string[];
}