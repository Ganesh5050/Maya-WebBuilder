import { Hono } from "hono";

interface Env {
  R2_BUCKET?: any;
  DB?: any;
}

const app = new Hono<{ Bindings: Env }>();

export default app;
