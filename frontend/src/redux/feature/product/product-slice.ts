"use client";

import { createSlice } from "@reduxjs/toolkit";
import { ProductState } from "./product-type";
import { getProducts } from "./product-action";

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
    status: "pending",
    limit: Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
    offset: 0,
    totalDocuments: 0,
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        resetProductError: (state) => {
            state.error = null;
            state.status = "pending";
        },
        socketProductStockDeduct: (state, action) => {
            const productsToDeduct: { product_uuid: string; quantity: number }[] = action.payload;

            productsToDeduct.forEach(({ product_uuid, quantity }) => {
                const productIndex = state.products.findIndex(p => p.uuid === product_uuid);

                if (productIndex !== -1) {
                    const currentStock = Number(state.products[productIndex].stock || "0");
                    const deductQuantity = Number(quantity || 0);
                    state.products[productIndex].stock = String(Math.max(currentStock - deductQuantity, 0));
                }
            });
        },
        socketProductStockIncrease: (state, action) => {
            const productsToDeduct: { product_uuid: string; quantity: number }[] = action.payload;

            productsToDeduct.forEach(({ product_uuid, quantity }) => {
                const productIndex = state.products.findIndex(p => p.uuid === product_uuid);

                if (productIndex !== -1) {
                    const currentStock = Number(state.products[productIndex].stock || "0");
                    const increaseQuantity = Number(quantity || 0);
                    state.products[productIndex].stock = String(Math.max(currentStock + increaseQuantity, 0));
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.status = "pending";
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.offset === 0) {
                    state.products = action.payload.data;
                } else {
                    const mergedProducts = [
                        ...state.products,
                        ...action.payload.data,
                    ];
                    state.products = Array.from(new Map(mergedProducts.map((product) => [product.uuid, product,])).values());
                }

                state.limit = action.payload.limit;
                state.offset = action.payload.offset;
                state.totalDocuments = action.payload.totalDocuments;
                state.error = null;
                state.status = "succeed";
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.status = "rejected";
                state.error = action.payload as string;
            });
    },
});

export const { resetProductError, socketProductStockDeduct, socketProductStockIncrease } = productSlice.actions;
export default productSlice.reducer;