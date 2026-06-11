import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { RabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisterService } from '../../feature/user/user-register/user-register.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';

@Module({
    providers: [
        RabbitMQService,
        RabbitMQConsumerInitializer,
        EventHandlerMapService,
        UserRegisterService,
        InboxRepository,
        UserRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class CatalogRabbitMQModule { }
