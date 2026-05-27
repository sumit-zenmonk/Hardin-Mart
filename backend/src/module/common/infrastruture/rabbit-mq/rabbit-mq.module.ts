import { Global, Module } from '@nestjs/common';
// Common Service
import { RabbitMQService } from './rabbit-mq.service';

// User Module
import * as UserUserRepository from 'src/module/user-module/infrastructure/repository/user.repository';

// Catalog Module
import * as CatalogUserRepository from 'src/module/catalog-module/infrastructure/repository/user.repository';
import * as CatalogInboxRepository from 'src/module/catalog-module/infrastructure/repository/inbox.repository';
import * as CatalogUserRegisteredConsumer from 'src/module/catalog-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as CatalogUserRegisterHandler from 'src/module/catalog-module/feature/user/user-register/user-register.handler';

// Sale Module
import * as SaleUserRepository from 'src/module/sale-module/infrastructure/repository/user.repository';
import * as SaleInboxRepository from 'src/module/sale-module/infrastructure/repository/inbox.repository';
import * as SaleUserRegisteredConsumer from 'src/module/sale-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as SaleUserRegisterHandler from 'src/module/sale-module/feature/user/user-register/user-register.handler';

// Billing Module
import * as BillingmoduleUserRepo from 'src/module/billing-module/infrastructure/repository/user.repository';
import * as BillingmoduleInboxRepo from 'src/module/billing-module/infrastructure/repository/inbox.repository';
import * as BillingmoduleOrderRepo from 'src/module/billing-module/infrastructure/repository/order.repository';
import * as BillingmoduleOrderItemRepo from 'src/module/billing-module/infrastructure/repository/order.item.repository';
import * as BillingUserRegisterService from 'src/module/billing-module/feature/user/user-register/user-register.service';
import * as BillingOrderCreatedService from 'src/module/billing-module/feature/order/order-created/order-created.handler';
import * as BillingUserConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as BillingOrderCreatedConsumer from 'src/module/billing-module/infrastructure/rabbit-mq-consumer/order/order-created/order-created.consumer';

@Global()
@Module({
    imports: [],
    providers: [
        // Common Service
        RabbitMQService,

        // User Module
        UserUserRepository.UserRepository,

        // Catalog Module
        CatalogUserRepository.UserRepository,
        CatalogInboxRepository.InboxRepository,
        CatalogUserRegisteredConsumer.UserRegisteredConsumer,
        CatalogUserRegisterHandler.UserRegisterService,

        // Sale Module
        SaleUserRepository.UserRepository,
        SaleInboxRepository.InboxRepository,
        SaleUserRegisteredConsumer.UserRegisteredConsumer,
        SaleUserRegisterHandler.UserRegisterService,

        // Billing Module
        BillingmoduleUserRepo.UserRepository,
        BillingmoduleInboxRepo.InboxRepository,
        BillingmoduleOrderRepo.OrderRepository,
        BillingmoduleOrderItemRepo.OrderItemRepository,
        BillingUserRegisterService.UserRegisterService, 
        BillingOrderCreatedService.OrderCreatedService,
        BillingUserConsumer.UserRegisteredConsumer,
        BillingOrderCreatedConsumer.OrderCreatedConsumer,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }