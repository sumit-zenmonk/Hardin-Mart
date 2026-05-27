import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderItemRepository } from "src/module/billing-module/infrastructure/repository/order.item.repository";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderCreatedMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";

@Injectable()
export class OrderCreatedService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
    ) { }

    async handle(order: OrderCreatedMQEventPayload) {
        await this.orderRepository.createOrder({ user_uuid: order.user_uuid, uuid: order.order_uuid, id: order.order_id, created_at: order.created_at });
        await Promise.all(
            order.items.map(item =>
                this.orderItemRepository.createOrderItem({
                    order_uuid: order.order_uuid,
                    product_uuid: item.product_uuid,
                    uuid: item.uuid,
                    id: item.id,
                    quantity: item.quantity,
                })
            )
        );
        return;
    }
}