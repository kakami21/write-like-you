import { Hono } from "hono";
import { createRefreshReviews } from "./create-refresh-reviews";
import { generateReview } from "./generate";
import { getReviewSource } from "./review-source";
import { getReviews } from "./reviews";

// Honoアプリケーションの作成
const app = new Hono<{ Bindings: CloudflareBindings }>();

// 文書生成API
app.post("/api/generate", (c) => {
  return generateReview(c.req.raw, c.env);
});

// POST以外のリクエストは405を返す
app.all("/api/generate", (c) => {
  c.header("Allow", "POST");
  return c.json({ error: "POSTで送信してください。" }, 405);
});

// ヘルスチェックAPI
app.get("/api/health", async (c) => {
  const styleSamples = await getReviewSource(c.env).getStyleSamples();
  return c.json({ status: "ok", writingSamples: styleSamples.length });
});

// 口コミ取得API
app.get("/api/reviews", (c) => {
  return getReviews(c.env);
});

// 404ハンドリング
app.all("/api/*", (c) => c.json({ error: "APIが見つかりません。" }, 404));
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

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
