// web.service.ts
// สร้าง service สำหรับเรียก API โดยอ่าน baseURL จาก environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getTodos() {
  const res = await fetch(`${API_BASE_URL}/todo`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

// สามารถเพิ่มฟังก์ชันอื่นๆ ได้ เช่น postTodo, deleteTodo เป็นต้น

// generic GET function
export async function get<T = any>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
