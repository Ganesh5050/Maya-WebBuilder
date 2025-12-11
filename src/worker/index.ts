import { Hono } from "hono";

interface Env {
  R2_BUCKET?: R2Bucket;
  DB?: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

export default app;
