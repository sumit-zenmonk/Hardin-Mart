import { BadRequestException, Injectable, Req } from "@nestjs/common";
import { BillingRepository } from "src/module/billing-module/infrastructure/repository/billing.repository";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { PayOrderDto } from "./pay-order.dto";
import { OrderRepository } from "src/module/billing-module/infrastructure/repository/order.repository";
import { OrderPaymentStatusEnum } from "src/module/billing-module/domain/order/order.enum";
import { WalletHistoryTypeEnum } from "src/module/billing-module/domain/wallet-history/wallet.enum";

@Injectable()
export class PayOrderService {
    constructor(
        private readonly billingRepository: BillingRepository,
        private readonly orderRepository: OrderRepository,
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

        // deduct amount from wallet
        wallet.balance -= order.total_price;
        await this.billingRepository.saveWallet(wallet);

        // make PayUsingCardment history
        await this.billingRepository.createHistory({
            user_uuid: user.uuid,
            order_uuid: body.order_uuid,
            amount: order.total_price,
            type: WalletHistoryTypeEnum.DEBIT,
            description: `Paid for order '${order.uuid}`,
        });

        return;
    }
}