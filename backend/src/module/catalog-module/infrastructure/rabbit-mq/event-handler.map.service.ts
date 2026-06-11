import { Injectable } from '@nestjs/common';
import { CatalogEventHandlerMap, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { UserRegisterService } from 'src/module/catalog-module/feature/user/user-register/user-register.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisterService: UserRegisterService,
        private readonly inboxRepository: InboxRepository,
    ) { }

    // Map event names to handlers
    public eventHandlerMap: CatalogEventHandlerMap = {
        'user.registered': (payload: UserRegisteredMQEventPayload) =>
            this.handleUserRegistered(payload),
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            console.log(`No handler found for event: ${eventName} in Catalog Module`);
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
}
