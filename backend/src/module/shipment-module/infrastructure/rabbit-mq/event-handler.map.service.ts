import { Injectable } from '@nestjs/common';
import { UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, OrderBilledMQEventPayload, ShipmentEventPayload, ShipmentEventHandlerMap } from './rabbit-mq.type';
import { UserRegisterService as ShipmentUserRegisterService } from 'src/module/shipment-module/feature/user/user-register/user-register.handler';
import { OrderPlacedService } from 'src/module/shipment-module/feature/order/order-placed/order-placed.handler';
import { OrderBilledService } from 'src/module/shipment-module/feature/order/order-billed/order-billed.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisterService: ShipmentUserRegisterService,
        private readonly orderPlacedService: OrderPlacedService,
        private readonly orderBilledService: OrderBilledService,
        private readonly inboxRepository: InboxRepository,
    ) { }

    // Map event names to handlers
    public eventHandlerMap: ShipmentEventHandlerMap = {
        'user.registered': (payload: UserRegisteredMQEventPayload) =>
            this.handleUserRegistered(payload),
        'order.placed': (payload: OrderPlacedMQEventPayload) =>
            this.handleOrderPlaced(payload),
        'order.billed': (payload: OrderBilledMQEventPayload) =>
            this.handleOrderBilled(payload),
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            console.log(`No handler found for event: ${eventName} in Shipment Module`);
            return;
        }

        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }
        await handler.call(this, payload, outbox_uuid, eventName);

        await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName });
    }

    async handleUserRegistered(payload: UserRegisteredMQEventPayload) {
        await this.userRegisterService.handle(payload);
    }

    async handleOrderPlaced(payload: OrderPlacedMQEventPayload) {
        await this.orderPlacedService.handle(payload);
    }

    async handleOrderBilled(payload: OrderBilledMQEventPayload) {
        await this.orderBilledService.handle(payload);
    }
}
