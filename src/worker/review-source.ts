import reviews from "../../data/reviews.json";
import reviewsMeta from "../../data/reviews-meta.json";
import { D1ReviewRepository } from "./d1-review-repository";

export function getReviewSource(env: CloudflareBindings) {
  if (env.REVIEW_SOURCE === "json") {
    return {
      async getAll() {
        return { reviews, lastUpdatedAt: reviewsMeta.lastUpdatedAt };
      },
    };
  }

  if (env.REVIEW_SOURCE === "d1") {
    return new D1ReviewRepository(env.DB);
  }

  throw new Error("REVIEW_SOURCEはjsonまたはd1を指定してください。");
}
