# コミットメッセージ生成ルール
Conventional Commits 1.0.0 に従ってコミットメッセージを生成してください。

## フォーマット
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]

## Type 一覧
- feat: 新機能の追加
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの意味に影響しない整形・フォーマット変更
- refactor: 機能追加やバグ修正を伴わないリファクタリング
- perf: パフォーマンス改善
- test: テストの追加・修正
- build: ビルド設定や依存関係の変更
- ci: CI/CD の設定変更
- chore: その他の保守・雑多な変更

## ルール
- ステージ済み（staged）の変更内容のみを根拠にコミットメッセージを生成すること。
- type は必ず小文字で記述すること。
- description は命令形（例: `add`, `fix`, `update`）で簡潔に記述すること。
- description の末尾に句点（`.`）を付けないこと。
- scope は必要な場合のみ付与すること。
- 常に `feat` を選ばず、変更内容に最も適した type を選択すること。
- 破壊的変更（Breaking Change）がある場合は `!` または `BREAKING CHANGE:` を使用すること。
- 出力はコミットメッセージのみとし、説明やコードブロック、前置き・後書きは含めないこと。
