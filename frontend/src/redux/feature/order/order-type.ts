export interface OrderItem {
    uuid: string;
    order_uuid: string;
    product_uuid: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface Order {
    uuid: string;
    user_uuid: string;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id?: string;
}

export interface OrderResponse {
    data: Order | Order[];
    totalDocuments?: number;
    limit?: number;
    offset?: number;
    message: string;
}

export interface CreateOrderPayload {
    items: {
        product_uuid: string;
        quantity: number;
    }[];
}

export interface OrderState {
    orders: Order[] | null;
    loading: boolean;
    error: string | null;
    status: "pending" | "succeed" | "rejected";
}