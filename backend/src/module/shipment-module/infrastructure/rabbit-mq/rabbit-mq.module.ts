import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { RabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisterService } from '../../feature/user/user-register/user-register.handler';
import { OrderPlacedService } from '../../feature/order/order-placed/order-placed.handler';
import { OrderBilledService } from '../../feature/order/order-billed/order-billed.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';
import { OrderRepository } from '../repository/order.repository';
import { ProductRepository } from '../repository/product.repository';
import { OutboxRepository } from '../repository/outbox.repository';

@Module({
    providers: [
        RabbitMQService,
        RabbitMQConsumerInitializer,
        EventHandlerMapService,
        UserRegisterService,
        OrderPlacedService,
        OrderBilledService,
        InboxRepository,
        OutboxRepository,
        UserRepository,
        OrderRepository,
        ProductRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class ShipmentRabbitMQModule { }
