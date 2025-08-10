//index
import "dotenv/config";
import { dbClient } from "@db/client.js";
import { todoTable } from "@db/schema.js";
import cors from "cors";
import Debug from "debug";
import { eq, count, ilike, and } from "drizzle-orm"; // ใช้นับจำนวนข้อมูลทั้งหมดในตาราง ซึ่งเป็นสิ่งจำเป็นในการคำนวณจำนวนหน้าทั้งหมด (totalPages)
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express"; // Import types with 'type' keyword
import type { ErrorRequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
const debug = Debug("pf-backend");

//Intializing the express app
const app = express();

//Middleware
app.use(morgan("dev", { immediate: false }));
app.use(helmet());
app.use(
  cors({
    origin: "*", // แก้ไข: อนุญาตให้ทุก origin
  })
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// Query - เพิ่ม Pagination
app.get("/todo", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page?.toString() || "1");
    const limit = parseInt(req.query.limit?.toString() || "10");
    const offset = (page - 1) * limit;

    // รับค่า search และ status จาก query string
    const searchQuery = req.query.search?.toString() || "";
    const statusQuery = req.query.status?.toString(); // 'done', 'notdone', or undefined

    // สร้างเงื่อนไขสำหรับ query
    const whereClauses = [];
    if (searchQuery) {
      // ใช้ ilike สำหรับ case-insensitive search
      whereClauses.push(ilike(todoTable.todoText, `%${searchQuery}%`));
    }
    if (statusQuery === 'done') {
      whereClauses.push(eq(todoTable.isDone, true));
    }
    if (statusQuery === 'notdone') {
      whereClauses.push(eq(todoTable.isDone, false));
    }
    
    // รวมเงื่อนไขทั้งหมดด้วย and()
    const finalWhere = and(...whereClauses);

    // นับจำนวนข้อมูลทั้งหมดตามเงื่อนไข
    const totalItemsResult = await dbClient
      .select({ count: count() })
      .from(todoTable)
      .where(finalWhere); // ใช้เงื่อนไขในการนับ
      
    const totalItems = totalItemsResult[0].count;

    // ดึงข้อมูลตามเงื่อนไขและ pagination
    const results = await dbClient.query.todoTable.findMany({
      where: finalWhere, // ใช้เงื่อนไขในการดึงข้อมูล
      limit: limit,
      offset: offset,
      orderBy: (table, { desc }) => [desc(table.createdAt)] // เรียงจากใหม่ไปเก่า (แนะนำ)
    });

    const totalPages = Math.ceil(totalItems / limit);

    // สร้างลิงก์สำหรับหน้าถัดไป
    const nextLink = page < totalPages ? `/todo?page=${page + 1}&limit=${limit}` : null;
    const prevLink = page > 1 ? `/todo?page=${page - 1}&limit=${limit}` : null;

    const response = {
      data: results,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        next: nextLink, // เพิ่ม next link
        prev: prevLink,
      },
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// Insert
app.put("/todo", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todoText = req.body.todoText ?? "";
    if (!todoText) throw new Error("Empty todoText");
    const result = await dbClient
      .insert(todoTable)
      .values({
        todoText,
      })
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Update
app.patch("/todo", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.body.id ?? "";
    const { todoText, isDone } = req.body;
    if (!id) throw new Error("Empty id"); // Check for existence if data

    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    const updateData: { todoText?: string; isDone?: boolean } = {};
    if (todoText !== undefined) updateData.todoText = todoText;
    if (isDone !== undefined) updateData.isDone = isDone;

    if (Object.keys(updateData).length === 0) {
      throw new Error("No data to update");
    }

    const result = await dbClient
      .update(todoTable)
      .set(updateData)
      .where(eq(todoTable.id, id))
      .returning({
        id: todoTable.id,
        todoText: todoTable.todoText,
        isDone: todoTable.isDone,
      });
    res.json({ msg: `Update successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id"); // Check for existence if data

    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    await dbClient.delete(todoTable).where(eq(todoTable.id, id));
    res.json({
      msg: `Delete successfully`,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/todo/all",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await dbClient.delete(todoTable);
      res.json({
        msg: `Delete all rows successfully`,
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }
);

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  debug(err.message);
  const errorResponse = {
    message: err.message || "Internal Server Error",
    type: err.name || "Error",
    stack: err.stack,
  };
  res.status(500).send(errorResponse);
};
app.use(jsonErrorHandler);

// Running app
const PORT = process.env.PORT || 3000;
// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});





