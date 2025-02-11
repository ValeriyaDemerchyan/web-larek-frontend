# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

После клонирования проекта установить зависимости:

npm install

Для запуска проекта в режиме разработки выполнить команду:

npm run start

# Сборка

Для сборки проекта в продакшен выполнить команду:

npm run build

Для данного проекта нет ограничений по использованию пакетного менеджера, поэтому можно использовать также YARN.

### Структура приложения

В проекте используется архитектурный шаблон MVP(Model-View-Presenter), в котором 
- Model (Модель) - отвечает за работу с данными приложения
- View (Представление) - отвечает за отображение данных пользователю
- Presenter (Представитель) - отвечает за связь между Моделью и Представителем

### Базовый код 

#### Класс Api
Класс, который способствует отправлению запросов к API
Конструктор состоит из 2 аргументов(baseUrl - базовый URL API и options - опции запроса)

Методы:
1) handlePesponse(response) - в случае успешного ответа от сервера возвращает объект JSON, если ответ не является успешным - ошибку (является защищенным методом)
2) getUri(uri) - отправляет GET-запрос к указанному URI
3) postUri(uri, data, method: ApiPostMethods = 'POST’) - отправляет именно POST-запрос к URI

#### Класс EventEmitter
Брокер событий. Есть возможность подписаться на все события или слушать события по шаблону

Методы:
1) on(eventName, callback) - установить обработчик на событие
2) off(eventName, callback) - снять обработчик с события
3) emit(eventName, Data) - инициировать событие с данными
4) onAll(callback) -установить обработчик на все события
5) offAll() - снять обработчик со всех событий
6) trigger(eventName, context) - создает колобке триггер, генерирующий событие при вызове


### Модели данных

#### Абстрактный класс Model<T>
 
Необходим для управления данными и обработки событий в приложении с помощью EventEmitter. В конструкторе принимает начальные данные модели и экземпляр для работы с событиями

Методы класса:

emitChanges - отправляет событие об изменении моделии, тем самым позволяет другим компонентам отслеживать обновления данных

#### Класс AppData

Расширяет функционал Model<IAppState>, описывает состояние приложения. Хрнаит данные о каталоге товаров, корзине, заказе, информации об ошибках. Также реализует
методы для управления всех вышеперечисленных компонентов приложения

Методы класса:

setCatalog - добавляет массив товаров в каталог
getCardIndex - возвращает индекс карточки в корзине
addToBasket - добавить товар в корзину
deleteFromBasket - удалить товар из корзины
clearBasket - очистить корзину
getTotalBasketPrice - общая сумма товаров в корзине
getBasketAmount - общее число товаров в корзине
setOrderPayment - устанавливает способ оплаты
setOrderAddress - устанавливает значение адреса доставки
setOrderPhone - устанавливает значение номера телефона
setOrderEmail - устанавливает значение электронной почты
validateOrder - валидация полей формы заказа

### Слой View

#### Класс Page

Поля класса:

_counter - элемент, отображающий количество товаров в корзине
_gallery - элемент, отображающий галерею товаров на странице
_wrapper - используется для блокировки интерфейса, элемент-обертка всей страницы
_basket - элемент, отображающий корзину

Методы класса:

counter - показывает количество товаров в корзине
gallery - Заменяет текущие элементы каталога на новые, переданные в массиве
locked - блокировка страницы (путем изменения класса у _wrapper)

#### Класс Form

Поля класса:

_submit - кнопка для отправки формы
_errors - элемент, который отображает ошибки при вводе некорректных данных в форму

Методы класса:

valid - отвечает за активное состояние кнопки отправки формы
errors - отображение текста ошибок
clearValue - очистка полей формы
protected onInputChanges - реагирует на изменение значений в полях формы
render - отображает обновленное состояние формы


#### Класс Popup

Поля класса:

_closeButton - элемент кнопки для закрытия попапа
_content - начинка попапа

Методы класса:

content - отображает новое содержимое попапа
open - открывает попап
close - закрывает попап
render - отрисовка попапа с переданными данными

#### Класс Order

Поля класса:

_address - адрес доставки
buttonNal - кнопка оплаты наличными
buttonOnline - кнопка онлайн-оплаты

Методы класса:

address - устанавливает значение адреса
togglePayButton - активирует выбранную кнопку оплаты
clearPayButton - сброс активного состояния для всех кнопок выбора способа оплаты

#### Класс Contacts

Поля класса:

_email - поле для электронной почты
_phone - поле для номера телефона

Методы класса:

email - устанавливает значение поля для ввода электронной почты
phone - устанавливает значение поля для ввода номера телефона

#### Класс Success

Поля класса:

close -элемент для закрытия попапа
description - элемент, отображающий описание для попапа потверждения

Методы класса:

total - текст в элементе, отображающем описание для попапа потверждения(общая стоимость заказа)

#### Класс Basket

Поля класса:

_list - список товаров в корзине
_total - общая стоимость товаров в корзине
_button - кнопка для оформления заказа

Методы класса:

items - устанавливает элементы в корзину
total - текст итоговой стоимости

#### Класс Card

Поля класса:

_title - название товара
_description - описание товара
_price - стоимость товара
_image -  картинка товара
_category - категория товара
_button - кнопка взаимодействия с карточкой

Методы класса:

id - устанавливает/получает id товара
title - устанавливает/получает название товара
description - устанавливает/получает описание товара
price - устанавливает/получает стоимость товара
image - устанавливает картинку товара 
category - устанавливает/получает категорию товара
button - устанавливает текст кнопки товара

#### Класс BasketCard:

Поля класса:

_index - индекс выбранного товара в корзине
_title - HTML-элемент для отображения названия товара
deleteButton - кнопка, служаща для удаления товара из корзины

Методы класса:

index - устанавливает и отображает индекс товара в корзине

### Слой Presenter

cards:changed - изменение каталога товаров
card:selected - выбор карточки в каталоге
card:basket - выбор карточки в корзине
basket:open - корзина открыта
basket:changed - изменение данных в корзине
popup:open - открыть попап
popup:close - закрыть попап
order:open - форма заказа открыта
order:changed - изменение в форме заказа
order:submit - переход на след. этап.
contacts:submit - подтверждение заказа
/^order..*:changed/ - изменение полей в форме заказа
formerrors:changed - валидация полей