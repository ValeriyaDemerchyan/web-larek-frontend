import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/AppData';
import { myApi } from './components/MyApi';
import { Card, BasketCard } from './components/Card';
import { Page } from './components/Page';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Order, Contacts } from './components/Order';
import { Success } from './components/common/SuccessOrder';
import { ICard, IOrder } from './types/index';

const api = new myApi(CDN_URL, API_URL);
const events =new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const pageBody = document.body;
const window = ensureElement<HTMLElement>('#modal-container');

const appData = new AppData({}, events);
const page = new Page(pageBody, events);
const modal = new Modal(window, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api.getCardList()
.then((cards: ICard[]) => {
    appData.setCatalog(cards);
})
.catch((err) => {
    console.error(err);
});

events.on('cards:changed', () => {
    page.gallery = appData.catalog.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('preview:changed', item);
            },
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category,
        })
    });
});

events.on('card:selected', (item: ICard) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('card:basket', item);
            events.emit('preview:changed', item);
            modal.close();
        },
    });
    modal.render({
        content: card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            button: appData.getButtonStatus(item),
        }),
    });
});

events.on('card:basket', (item: ICard) => {
    appData.toggleBasketState(item);
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.total = appData.getTotalPrice();
    basket.items = appData.basket.map((basketCard) => {
        const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.deleteFromBasket(basketCard);
            },
        });
        newBasketCard.index = appData.getCardIndex(basketCard);
        return newBasketCard.render({
            title: basketCard.title,
            price: basketCard.price,
        });
    });
});

events.on('order:open', () => {
    order.clearPayButton();
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on(/^order\..*:changed/, (data: {
    field: keyof Pick<IOrder, 'address' | 'phone' | 'email'>;
    value: string;
}) => {
    appData.setOrderField(data.field, data.value);
});

events.on('order:changed', (data: { payment: string, button: HTMLButtonElement}) => {
    order.togglePayButton(data.button);
    appData.setOrderPayment(data.payment);
    appData.validateOrder();
});

events.on('formErrors:changed', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address })
    .filter((i) => !!i)
    .join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone })
    .filter((i) => !!i)
    .join('; ');
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('contacts:submit', () => {
    appData.setBasketToOrder();
    api.orderItems(appData.order)
    .then((res) => {
        const successWindow = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
            },
        });
        appData.clearBasket();
        appData.clearOrderState();

        modal.render({ content: successWindow.render({ total: res.total }) });
    })
    .catch((err) => {
        console.error(`Ошибка при выполнении заказа ${err}`);
    });
});