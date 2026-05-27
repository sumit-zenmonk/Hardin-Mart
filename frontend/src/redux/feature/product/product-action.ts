"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const getProducts = createAsyncThunk(
    "product/list",
    async (
        { limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10, offset = Number(process.env.NEXT_PUBLIC_PAGE_OFFSET) || 0 }: { limit?: number; offset?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await fetch(
                `${API_URL}/product?limit=${limit}&offset=${offset}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            const result = await res.json();

            if (!res.ok) { throw new Error(result.message); }

            return result;
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)