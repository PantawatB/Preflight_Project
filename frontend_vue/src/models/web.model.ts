export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  next: number | null;
  prev: number | null;
}

export interface TodoListResponse {
  data: TodoItem[];
  pagination: Pagination;
}