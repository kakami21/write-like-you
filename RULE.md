# ドキュメント記述ルール

## 目的

コードの役割、HTTP APIの仕様、開発中の補足を、それぞれ適した方法で記録する。

## 基本方針

| 対象 | 使用するもの | 主な閲覧方法 |
| --- | --- | --- |
| 関数・型・クラス | JSDoc + TypeDoc | VS Codeのホバー表示、生成したHTML |
| HTTP API | OpenAPI + Swagger UI | ブラウザー上のAPI仕様画面 |
| 実装理由や注意事項 | 通常のコメント | ソースコード、VS Code |

コメントには、コードを読めば分かる処理の言い換えではなく、利用者が知る必要のある仕様や、コードだけでは分からない理由を書く。

## JSDoc

外部から利用される関数、型、クラスには、必要に応じてJSDocを書く。型や関数名から明らかな情報は繰り返さない。

### 関数の例

```ts
/**
 * 過去の口コミを参考に、新しい口コミの下書きを生成する。
 *
 * @param request - 店舗情報と感想を含むHTTPリクエスト
 * @param env - Workers AIなどのCloudflareバインディング
 * @returns 生成結果を格納したHTTPレスポンス
 */
export async function generateReview(
  request: Request,
  env: CloudflareBindings,
): Promise<Response> {
  // ...
}
```

### 型の例

```ts
/** 口コミ生成に必要な入力値。 */
export type GenerateReviewInput = {
  /** 店舗名。 */
  restaurantName: string;
  /** 利用者が入力した料理や接客についての感想。 */
  impression: string;
};
```

### TypeDocの役割

TypeDocはJSDocからHTMLドキュメントを生成するために使う。TypeDocを導入するまでは、同じJSDocをVS Codeのホバー表示と入力補完で確認する。

## OpenAPI

HTTPメソッド、パス、入力、レスポンス、ステータスコードはOpenAPIに記載する。ルート関数のJSDocだけをAPI仕様書の代わりにしない。

### `/api/generate`の例

```yaml
/api/generate:
  post:
    summary: 口コミの下書きを生成する
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - restaurantName
              - impression
            properties:
              restaurantName:
                type: string
              impression:
                type: string
    responses:
      "200":
        description: 生成成功
      "400":
        description: 入力内容が不正
      "405":
        description: POST以外のメソッドで送信された
      "500":
        description: 生成処理に失敗
```

### Swagger UIの役割

Swagger UIはOpenAPIを読み込み、APIの入力項目とレスポンスをブラウザー上で確認するために使う。OpenAPIとSwagger UIを導入した場合も、実装と仕様が食い違わないよう同時に更新する。

## 通常のコメント

通常のコメントは、実装上の意図、制約、処理順序が重要な箇所だけに書く。

### 良い例

```ts
// 未定義のAPIだけを404にし、画面へのアクセスは静的ファイルへ渡す。
app.all("/api/*", (c) => c.json({ error: "APIが見つかりません。" }, 404));
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));
```

### 避ける例

```ts
// 口コミを取得する。
app.get("/api/reviews", (c) => {
  return getReviews(c.env);
});
```

関数名と処理内容から目的が明らかなため、このコメントは追加情報にならない。

## 更新ルール

- 関数や型の公開仕様を変更したら、対応するJSDocも更新する。
- APIのパス、入力、出力、ステータスコードを変更したら、OpenAPIも更新する。
- コメントと実装が食い違った場合は、実装意図を確認して同じ変更内で修正する。
- 一時的な作業メモを恒久的なコメントとして残さない。
- TypeDoc、OpenAPI、Swagger UIは、必要になった時点で依存関係と公開方法を別途決めて導入する。
