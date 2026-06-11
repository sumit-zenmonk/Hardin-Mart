import { Injectable } from "@nestjs/common";
import { OrderShippingLabelCreatedMQEventPayload, ShippingPolicyType } from "./shipping.policy.type";
import { OutboxRepository } from "../../repository/outbox.repository";
import { PolicyClass } from "src/common/infrastruture/policy/policy.abstract";

@Injectable()
export class ShippingPolicyService extends PolicyClass {
    constructor(
        private readonly outboxRepository: OutboxRepository,
    ) {
        super();
    }

    async handleSetPolicy(key: string, policy: ShippingPolicyType) {
        this.policyMap.set(key, policy);
        await this.handleProcess(key);
        return;
    }

    handleGetPolicy(key: string) {
        const shippingPolicy = this.policyMap.get(key);
        if (shippingPolicy) {
            return shippingPolicy;
        }
        console.log(`ShippingPolicy with key ${key} not found`);
        return;
    }

    handleRemovePolicy(key: string) {
        this.policyMap.delete(key);
        return;
    }

    async handleProcess(key: string) {
        const policy = this.handleGetPolicy(key);
        if (policy && policy.is_billed && policy.is_placed) {
            await this.outboxRepository.createOutboxEntry({
                exchange_name: this.SHIPPING_EXCHANGE,
                event_name: 'shipping.label.created',
                message_payload: {
                    order_uuid: policy.data.order_uuid,
                    customer_uuid: policy.data.customer_uuid,
                },
            });
            this.handleRemovePolicy(key);
        }
        return;
    }
}