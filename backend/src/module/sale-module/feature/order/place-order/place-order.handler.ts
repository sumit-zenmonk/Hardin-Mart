import { BadRequestException, Injectable } from "@nestjs/common";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";
import { Transactional } from "typeorm-transactional";
import type { Request } from "express";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";

@Injectable()
export class PlaceOrderService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async handle(req: Request, order_uuid: string) {
        // create outbox entry
        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_PLACED,
            message_payload: {
                order_uuid: order_uuid,
                user_uuid: req.user.uuid,
            },
        });

        await this.socketService.emitToUser(
            req.user.uuid,
            SocketEventNameEnum.ORDER_STATUS_CHANGED,
            {
                order_uuid,
                order_status: OrderStatusEnum.PLACED,
            },
        );

        return;
    }
}