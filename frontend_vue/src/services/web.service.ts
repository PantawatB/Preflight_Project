// ฟังก์ชันแก้ไข todo แบบ PATCH (ตามตัวอย่าง React)
// ฟังก์ชันแก้ไข todo แบบ PATCH (รองรับอัปเดต isDone ด้วย)
export async function updateTodo(id: string, todoText: string, isDone?: boolean) {
  const body: any = { id, todoText };
  if (typeof isDone === 'boolean') body.isDone = isDone;
  const res = await fetch(`${API_BASE_URL}/todo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
// ฟังก์ชันเพิ่ม todo แบบ PUT (ตามตัวอย่าง React)
export async function addTodo(todoText: string) {
  const res = await fetch(`${API_BASE_URL}/todo`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ todoText }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
// ฟังก์ชันลบ todo แบบ body (เช่นกรณี backend รับ id ใน body)
export async function deleteTodo(id: string) {
  const res = await fetch(`${API_BASE_URL}/todo`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('API error');
  if (res.status === 204) return true;
  return res.json();
}
// web.service.ts
// สร้าง service สำหรับเรียก API โดยอ่าน baseURL จาก environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ปรับให้ return เฉพาะ data array จาก response ใหม่
export async function getTodos() {
  const res = await fetch(`${API_BASE_URL}/todo`);
  if (!res.ok) throw new Error('API error');
  const result = await res.json();
  return result.data; // return เฉพาะ array ของ todo
}

// สามารถเพิ่มฟังก์ชันอื่นๆ ได้ เช่น postTodo, deleteTodo เป็นต้น

// generic GET function
export async function get<T = any>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
