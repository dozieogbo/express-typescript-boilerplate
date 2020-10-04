export interface Response<T = any>{
    message?: string;
    data: T;
}

interface PaginatedResponseMeta {
    perPage: number;
    currentPage: number;
    totalPages: number;
    count: number,
    total: number;
}

export interface PaginatedResponse<T = any>{
    message?: string;
    data: T[];
    meta: PaginatedResponseMeta;
}