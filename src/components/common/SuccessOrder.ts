import { Component } from "../base/component";
import { ensureElement } from "../../utils/utils";
import { ISuccess, ISuccessEvents } from "../../types/index";

export class Success extends Component<ISuccess> {
    protected close: HTMLElement;
    protected description: HTMLElement;

    constructor (container: HTMLElement, actions: ISuccessEvents) {
        super(container);

        this.description = container.querySelector('.order-success__description');
        this.close = ensureElement<HTMLElement> (
            '.order-success__close',
            this.container
        );

        if (actions.onClick) {
            this.close.addEventListener('click', actions.onClick);
        }
    }

    set total (total: number) {
        this.setText(this.description, `Списано ${total} синапсов`);
    }
}