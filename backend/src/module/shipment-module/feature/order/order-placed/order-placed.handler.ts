import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import type { OrderPaidMQEventPayload, OrderPlacedMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { runOnTransactionCommit, Transactional } from "typeorm-transactional";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";

@Injectable()
export class OrderPlacedService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly socketService: SocketService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async handle(order: OrderPlacedMQEventPayload) {
        await this.orderRepository.updateOrderStatus(order.order_uuid, OrderStatusEnum.PLACED);

        await this.socketService.emitToUser(
            order.user_uuid,
            SocketEventNameEnum.ORDER_STATUS_CHANGED,
            {
                order_uuid: order.order_uuid,
                order_status: OrderStatusEnum.PLACED,
            },
        );
        return;
    }
}