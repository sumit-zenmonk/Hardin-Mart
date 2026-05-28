import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { PayOrderDto } from "./pay-order.dto";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";
import { OutboxRepository } from "src/module/billing-module/infrastructure/repository/outbox.repository";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";

@Injectable()
export class PayOrderService {
    constructor(
        private readonly billingRepository: BillingRepository,
        private readonly orderRepository: OrderRepository,
        private readonly outboxRepository: OutboxRepository,
        private readonly socketService: SocketService,
    ) { }

    async payOrder(user: UserEntity, body: PayOrderDto) {
        const { order_uuid } = body;
        let wallet = await this.billingRepository.findWallet(user.uuid);
        if (!wallet) {
            wallet = await this.billingRepository.createWallet({ user_uuid: user.uuid, balance: 0 });
        }

        const order = await this.orderRepository.findByUserUuidAndOrderUuid(user.uuid, order_uuid);
        if (!order) {
            throw new BadRequestException("Order not found");
        }
        if (order.payment_status !== OrderPaymentStatusEnum.PENDING) {
            throw new BadRequestException("Order payment can't able to process now");
        }
        if (wallet?.balance < order.total_price) {
            throw new BadRequestException("Balance is low . Please do add amount");
        }

        // deduct amount from wallet and payment status changed
        wallet.balance -= order.total_price;
        await this.billingRepository.saveWallet(wallet);
        await this.orderRepository.updateOrderPaymentStatus(order_uuid, OrderPaymentStatusEnum.PAID);

        // make PayUsingCardment history
        await this.billingRepository.createHistory({
            user_uuid: user.uuid,
            order_uuid: body.order_uuid,
            amount: order.total_price,
            type: WalletHistoryTypeEnum.DEBIT,
            description: `Paid for order '${order.uuid}`,
        });
        // make entry of publish exchange
        await this.outboxRepository.createOutboxntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_PAID,
            message_payload: {
                order_uuid,
                user_uuid: user.uuid
            },
        });

        await this.socketService.emitToUser(user.uuid, SocketEventNameEnum.ORDER__PAYMENT_STATUS_CHANGED, { order_uuid: order_uuid, payment_status: OrderPaymentStatusEnum.PAID });

        return;
    }
}