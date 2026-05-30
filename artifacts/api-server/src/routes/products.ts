import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, insertProductSchema } from "@workspace/db";
import {
  ListProductsResponse,
  CreateProductBody,
  UpdateProductBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.sortOrder, productsTable.id);
    const data = ListProductsResponse.parse(
      rows.map((r) => ({
        ...r,
        websiteUrl: r.websiteUrl ?? null,
        apkUrl: r.apkUrl ?? null,
        githubUrl: r.githubUrl ?? null,
      }))
    );
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "listProducts failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req: Request, res: Response) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const insertData = insertProductSchema.parse(parsed.data);
    const [row] = await db.insert(productsTable).values(insertData).returning();
    res.status(201).json({
      ...row,
      websiteUrl: row.websiteUrl ?? null,
      apkUrl: row.apkUrl ?? null,
      githubUrl: row.githubUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "createProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  try {
    const [row] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!row) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({
      ...row,
      websiteUrl: row.websiteUrl ?? null,
      apkUrl: row.apkUrl ?? null,
      githubUrl: row.githubUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "getProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const [existing] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const [row] = await db
      .update(productsTable)
      .set(parsed.data)
      .where(eq(productsTable.id, id))
      .returning();
    res.json({
      ...row,
      websiteUrl: row.websiteUrl ?? null,
      apkUrl: row.apkUrl ?? null,
      githubUrl: row.githubUrl ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "updateProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  try {
    const [existing] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "deleteProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
