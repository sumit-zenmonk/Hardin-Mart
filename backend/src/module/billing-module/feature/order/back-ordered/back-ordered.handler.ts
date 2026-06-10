import { Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import type { BackOrderedMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { Transactional } from "typeorm-transactional";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";

@Injectable()
export class BackOrderedService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handle(order: BackOrderedMQEventPayload) {
        const orderData = await this.orderRepository.findByUserUuidAndOrderUuid(order.customer_uuid, order.order_uuid);
        if (!orderData) {
            return;
        }

        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.BILLING_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_REFUND,
            message_payload: {
                order_uuid: order.order_uuid,
                customer_uuid: order.customer_uuid,
                reason: "Stock not available",
            },
        });

        return;
    }
}