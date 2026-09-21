import { Hono } from "hono";
import { createRefreshReviews } from "./create-refresh-reviews";
import { getReviews } from "./reviews";

// Honoアプリケーションの作成
const app = new Hono<{ Bindings: CloudflareBindings }>();

// ヘルスチェックAPI
app.get("/api/health", (c) => {
  c.header("Cache-Control", "no-store");
  return c.json({ status: "ok" });
});

// 口コミ取得API
app.get("/api/reviews", (c) => {
  return getReviews(c.env);
});

// 404ハンドリング
app.all("/api/*", (c) => {
  return c.json({ error: "APIが見つかりません。" }, 404)
});

// エラーハンドリング
app.onError((error, c) => {
  console.error("Request failed", error);
  return c.json({ error: "生成に失敗しました。時間をおいて再度お試しください。" }, 500);
});

// 定期実行のハンドラ
export default {
  fetch: app.fetch,
  async scheduled(_controller, env) {
    console.log("口コミの定期更新を開始します");
    const result = await createRefreshReviews(env).execute();
    console.log("口コミの定期更新が完了しました", result);
  },
} satisfies ExportedHandler<CloudflareBindings>;
