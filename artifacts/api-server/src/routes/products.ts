import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, insertProductSchema } from "@workspace/db";
import {
  ListProductsResponse,
  CreateProductBody,
  UpdateProductBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middleware/requireAuth";

const router: IRouter = Router();

const VALID_LIFECYCLE_STATES = ["draft", "published", "archived"] as const;
type LifecycleState = (typeof VALID_LIFECYCLE_STATES)[number];

function normalizeProduct(r: typeof productsTable.$inferSelect) {
  return {
    ...r,
    websiteUrl: r.websiteUrl ?? null,
    apkUrl: r.apkUrl ?? null,
    githubUrl: r.githubUrl ?? null,
  };
}

router.get("/products", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.publishedState, "published"))
      .orderBy(productsTable.sortOrder, productsTable.id);
    const data = ListProductsResponse.parse(rows.map(normalizeProduct));
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "listProducts failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/products", requireAuth, async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(productsTable.sortOrder, productsTable.id);
    res.json(rows.map(normalizeProduct));
  } catch (err) {
    req.log.error({ err }, "adminListProducts failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", requireAuth, async (req: Request, res: Response) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    // Auto-assign sortOrder to max + 1 if not provided
    let sortOrder = parsed.data.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const rows = await db.select({ sortOrder: productsTable.sortOrder }).from(productsTable).orderBy(productsTable.sortOrder);
      sortOrder = rows.length > 0 ? Math.max(...rows.map((r) => r.sortOrder)) + 1 : 0;
    }
    const insertData = insertProductSchema.parse({
      ...parsed.data,
      sortOrder,
      publishedState: parsed.data.publishedState ?? "draft",
    });
    const [row] = await db.insert(productsTable).values(insertData).returning();
    res.status(201).json(normalizeProduct(row));
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
    res.json(normalizeProduct(row));
  } catch (err) {
    req.log.error({ err }, "getProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/products/:id", requireAuth, async (req: Request, res: Response) => {
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
    res.json(normalizeProduct(row));
  } catch (err) {
    req.log.error({ err }, "updateProduct failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/products/:id/lifecycle", requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const { state } = req.body ?? {};
  if (!VALID_LIFECYCLE_STATES.includes(state as LifecycleState)) {
    res.status(400).json({ error: `state must be one of: ${VALID_LIFECYCLE_STATES.join(", ")}` });
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
      .set({ publishedState: state as LifecycleState })
      .where(eq(productsTable.id, id))
      .returning();
    req.log.info({ id, state }, "Product lifecycle updated");
    res.json(normalizeProduct(row));
  } catch (err) {
    req.log.error({ err }, "updateProductLifecycle failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", requireAuth, async (req: Request, res: Response) => {
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
