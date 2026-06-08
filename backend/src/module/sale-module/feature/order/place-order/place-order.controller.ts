import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { PlaceOrderService } from "./place-order.handler";

@Controller()
export class PlaceOrderController {
    constructor(private readonly placeOrderService: PlaceOrderService) { }

    @Patch(':uuid/place')
    async placeOrder(@Req() req: Request, @Param('uuid') uuid: string) {
        await this.placeOrderService.handle(req, uuid);

        return {
            message: "Order placed Successfully",
        };
    }
}