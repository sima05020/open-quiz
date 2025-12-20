# Vercel Postgres 環境変数設定ガイド

## 環境変数について

このアプリはVercel Postgresを使用するため、以下の環境変数が必要です：

### ローカル開発環境（`.env.local`）

```
POSTGRES_URLCONNECT=postgresql://user:password@host:5432/database
```

### Vercel環境（本番環境）

Vercel ダッシュボードの**Settings** → **Environment Variables**で同じキーを設定してください。

## Vercel Postgresの取得手順

### 1. Vercelダッシュボードで新規プロジェクト作成

1. [Vercelダッシュボード](https://vercel.com/dashboard)にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリを選択（または新規作成）

### 2. Postgresデータベースを追加

1. プロジェクト → **Storage** タブ
2. **Create Database** → **Postgres** を選択
3. 「Create** ボタンをクリック

### 3. 接続文字列を取得

1. 作成したPostgresデータベースをクリック
2. **.env.local** タブを開く
3. `POSTGRES_URLCONNECT` をコピー

### 4. ローカル開発環境に設定

プロジェクトのルートに `.env.local` ファイルを作成：

```bash
echo "POSTGRES_URLCONNECT=postgresql://..." > .env.local
```

（`postgresql://...` は上記で取得した接続文字列に置き換え）

## データベーステーブルの作成

Vercel Postgresのコンソールまたはpsqlで以下のSQLを実行：

```sql
-- プロフィールテーブル
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- クイズ投稿テーブル
CREATE TABLE IF NOT EXISTS quiz_posts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- クイズ回答テーブル
CREATE TABLE IF NOT EXISTS quiz_answers (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id INT NOT NULL REFERENCES quiz_posts(id) ON DELETE CASCADE,
  opened_letters INT NOT NULL,
  answer TEXT NOT NULL,
  correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_quiz_id ON quiz_answers(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_posts_user_id ON quiz_posts(user_id);
```

## トラブルシューティング

### `Error: Cannot find module '@vercel/postgres'`

```bash
npm install @vercel/postgres
```

### `error: password authentication failed`

- `POSTGRES_URLCONNECT` が正しいか確認
- Vercelダッシュボードで接続文字列を再度確認

### `error: relation "profiles" does not exist`

- SQLテーブルが作成されていない
- 上記のSQLスクリプトを実行

### ローカルテスト時にデータベース接続エラー

- `npm install` を実行して依存関係をインストール
- `.env.local` が正しい場所（プロジェクトルート）に存在するか確認
