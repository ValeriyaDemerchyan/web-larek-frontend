import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IModalData } from "../../types/index";

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement> (
            '.modal__close',
            container
        );

        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.container.querySelector('.modal__container').addEventListener('click', (e) => e.stopPropagation());
    }

    set content (value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open')
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render (data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}