export enum ExchangeTypeEnum {
    DIRECT = 'direct',
    FANOUT = 'fanout',
    TOPIC = 'topic',
    HEADERS = 'headers',
}

export enum XMatchHeaderEnum {
    ALL = 'all',
    ANY = 'any'
}

export enum RetryMechanismHeaderEnum {
    XREQUEUETRY = 'x-requeue-try'
}

// which exchange belong to
export enum ExchangeNameEnum {
    USER_EXCHANGE = 'user.exchange',

    ORDER_EXCHANGE = 'order.exchange',
}

// exchange name + routing key
export enum RoutingKeyEnum {
    USER_REGISTERED = 'user.registered',

    ORDER_CREATED = 'order.created'
}

// queue name (module name) + routing key + endfix(queue)
export enum QueueEnum {
    CATALOG_USER_REGISTERED_QUEUE = 'catalog.user.registered.queue',
    SALE_USER_REGISTERED_QUEUE = 'sale.user.registered.queue',
    BILLING_USER_REGISTERED_QUEUE = 'billing.user.registered.queue',

    BILLING_ORDER_CREATED_QUEUE = 'billing.order.created.queue',
}
