import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { GetAccountModule } from "./get-wallet/get-wallet.module";
import { GetPayHistoryModule } from "./get-pay-history/get-pay-history.module";

@Module({
    imports: [
        GetAccountModule,
        GetPayHistoryModule,
        RouterModule.register([
            {
                path: 'wallet',
                children: [
                    { path: '', module: GetAccountModule },
                    { path: '', module: GetPayHistoryModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class WalletModule { }