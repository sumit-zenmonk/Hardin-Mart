import { Module } from "@nestjs/common";
import { PlaceOrderController } from "./place-order.controller";
import { PlaceOrderService } from "./place-order.handler";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [PlaceOrderController],
    providers: [PlaceOrderService, OutboxRepository],
    exports: [],
})
export class PlaceOrderModule { }
