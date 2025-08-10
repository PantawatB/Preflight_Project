//index
import "dotenv/config";
import { dbClient } from "@db/client.js";
import { todoTable } from "@db/schema.js";
import { ownerTable } from "@db/schema.js";
import cors from "cors";
import Debug from "debug";
import { eq } from "drizzle-orm";
import type { ErrorRequestHandler } from "express";
import express from "express";
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
    origin: false, // Disable CORS
    // origin: "*", // Allow all origins
  })
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// Query
app.get("/todo", async (req, res, next) => {
  try {
    const results = await dbClient.query.todoTable.findMany();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Insert
app.put("/todo", async (req, res, next) => {
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
app.patch("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    const todoText = req.body.todoText ?? "";
    if (!todoText || !id) throw new Error("Empty todoText or id");

    // Check for existence if data
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");

    const result = await dbClient
      .update(todoTable)
      .set({ todoText })
      .where(eq(todoTable.id, id))
      .returning({ id: todoTable.id, todoText: todoTable.todoText });
    res.json({ msg: `Update successfully`, data: result });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", async (req, res, next) => {
  try {
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id");

    // Check for existence if data
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

app.post("/todo/all", async (req, res, next) => {
  try {
    await dbClient.delete(todoTable);
    res.json({
      msg: `Delete all rows successfully`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

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
const PORT = process.env.PORT || 3093;
// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});

////////////////////////////////////////////////
// ========== OWNER ROUTES ==========

// GET all owner data
app.get("/todo/owner", async (req, res, next) => {
  try {
    const results = await dbClient.query.ownerTable.findMany();
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// INSERT new owner
app.put("/todo/owner", async (req, res, next) => {
  try {
    const { id, Name, course_id, section } = req.body;
    if (!id || !Name || !course_id || !section)
      throw new Error("Missing required fields");

    const result = await dbClient
      .insert(ownerTable)
      .values({ id, Name, course_id, section })
      .returning();

    res.json({ msg: `Owner inserted successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// UPDATE owner
app.patch("/todo/owner", async (req, res, next) => {
  try {
    const { id, Name, course_id, section } = req.body;
    if (!id) throw new Error("Missing id");

    const results = await dbClient.query.ownerTable.findMany({
      where: eq(ownerTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid owner id");

    const result = await dbClient
      .update(ownerTable)
      .set({ Name, course_id, section })
      .where(eq(ownerTable.id, id))
      .returning();

    res.json({ msg: `Owner updated successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// DELETE owner by ID
app.delete("/todo/owner", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error("Missing id");

    const results = await dbClient.query.ownerTable.findMany({
      where: eq(ownerTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid owner id");

    await dbClient.delete(ownerTable).where(eq(ownerTable.id, id));
    res.json({ msg: `Owner deleted successfully`, data: { id } });
  } catch (err) {
    next(err);
  }
});

// DELETE all owners
app.post("/todo/owner/all", async (req, res, next) => {
  try {
    await dbClient.delete(ownerTable);
    res.json({ msg: `Deleted all owners successfully`, data: {} });
  } catch (err) {
    next(err);
  }
});
