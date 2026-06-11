import { Injectable } from '@nestjs/common';
import { UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, BackOrderedMQEventPayload, BillingEventHandlerMap } from './rabbit-mq.type';
import { UserRegisterService as BillingUserRegisterService } from 'src/module/billing-module/feature/user/user-register/user-register.handler';
import { OrderPlacedService } from 'src/module/billing-module/feature/order/order-placed/order-placed.handler';
import { OrderRefundService } from 'src/module/billing-module/feature/order/order-refund/order-refund.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisterService: BillingUserRegisterService,
        private readonly orderPlacedService: OrderPlacedService,
        private readonly orderRefundService: OrderRefundService,
        private readonly inboxRepository: InboxRepository,
    ) { }

    // Map event names to handlers
    public eventHandlerMap: BillingEventHandlerMap = {
        'user.registered': (payload: UserRegisteredMQEventPayload) =>
            this.handleUserRegistered(payload),
        'order.placed': (payload: OrderPlacedMQEventPayload) =>
            this.handleOrderPlaced(payload),
        'back.ordered': (payload: BackOrderedMQEventPayload) =>
            this.handleBackOrdered(payload),
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            console.log(`No handler found for event: ${eventName} in Billing Module`);
            return;
        }

        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }
        await handler.call(this, payload);

        await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName });
    }

    async handleUserRegistered(payload: UserRegisteredMQEventPayload) {
        await this.userRegisterService.handle(payload);
    }

    async handleOrderPlaced(payload: OrderPlacedMQEventPayload) {
        await this.orderPlacedService.handle(payload.customer_uuid, { order_uuid: payload.order_uuid });
    }

    async handleBackOrdered(payload: BackOrderedMQEventPayload) {
        await this.orderRefundService.handle(payload);
    }
}
