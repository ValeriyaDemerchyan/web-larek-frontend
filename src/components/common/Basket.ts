import { Component  } from "../base/component";
import { IEvents } from "../base/events";
import { createElement, ensureElement } from "../../utils/utils";
import { IBasket  } from "../../types/index";

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items (items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._list.replaceChildren(
                createElement('p', { textContent: 'В корзине нет товаров' })
            );
            this.setDisabled(this._button, true);
        }
    }

    set total (total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}