import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OrderPaidMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";

@Injectable()
export class OrderPaidService {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    async handle(order: OrderPaidMQEventPayload) {
        await this.orderRepository.updateOrderStatus(order.order_uuid, OrderStatusEnum.BILLED);
        return;
    }
}