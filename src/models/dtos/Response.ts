export class Response<T = any>{
    message?: string;
    data: T;
}

class PaginatedResponseMeta {
    perPage: number;
    currentPage: number;
    totalPages: number;
    count: number;
    total: number;
}

export class PaginatedResponse<T = any>{
    message?: string;
    data: T[];
    meta: PaginatedResponseMeta;
}