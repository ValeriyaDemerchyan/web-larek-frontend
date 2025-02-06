export type CardType = 
'другое'
'софт-скил'
'дополнительное'
'кнопка'
'хард-скил';

export type CardBasket = Pick<ICard, 'id' | 'title' | 'price'>;


export interface IAppState {
    catalog: ICard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
}

export interface IPage {
    counter: number;
    gallery: HTMLElement[];
    locked: boolean;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface ICard {
    id: string;
    title: string;
    description?: string;
    price: number | null;
    image: string;
    category: CardType;
    button: string;
}

export interface IOrder {
    address?: string;
    total?: number;
    items?: string[];
    email?: string;
    phone?: string;
    payment?: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface ISuccess {
    close: HTMLButtonElement;
    description: HTMLSpanElement;
    total: number;
}

export interface IBasket {
    items: CardBasket[];
    total: number | null;
}