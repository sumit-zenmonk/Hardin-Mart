export interface Product {
    uuid: string
    name: string
    description: string
    image_url: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface ProductResponse {
    data: Product[]
    limit: number
    offset: number
    totalDocuments: number
    message: string
}

export interface ProductState {
    products: Product[]
    loading: boolean
    error: string | null
    status: "pending" | "succeed" | "rejected"
    limit: number
    offset: number
    totalDocuments: number
}