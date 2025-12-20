# Vercelへのデプロイ手順

## 準備

### 1. Vercel Postgresの設定

1. Vercel ダッシュボードにログイン
2. プロジェクトを選択（または新規作成）
3. **Storage** → **Postgres** → **Create Database**
4. Database の詳細を確認し、`.env.local` に `POSTGRES_URLCONNECT` をコピー

### 2. データベーススキーマの作成

Vercel Postgresのコンソールまたはpsqlで以下のSQLを実行してください：

```sql
-- プロフィールテーブル
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- クイズ投稿テーブル
CREATE TABLE quiz_posts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- クイズ回答テーブル
CREATE TABLE quiz_answers (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id INT NOT NULL REFERENCES quiz_posts(id) ON DELETE CASCADE,
  opened_letters INT NOT NULL,
  answer TEXT NOT NULL,
  correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックスを作成（クエリパフォーマンス向上）
CREATE INDEX idx_quiz_answers_user_id ON quiz_answers(user_id);
CREATE INDEX idx_quiz_answers_quiz_id ON quiz_answers(quiz_id);
CREATE INDEX idx_quiz_posts_user_id ON quiz_posts(user_id);
```

### 3. ローカルで動作確認

```bash
npm install
npm run dev
```

`http://localhost:3000` でアプリを確認

### 4. Vercelにデプロイ

#### 方法A: GitHubを通じたデプロイ（推奨）

1. リポジトリをGitHubにプッシュ
2. Vercel ダッシュボードで「Import Project」
3. GitHubリポジトリを選択
4. 環境変数を設定（`POSTGRES_URLCONNECT`）
5. デプロイ

#### 方法B: Vercel CLIを使用

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel
```

### 5. デプロイ後の検証

1. Vercel URLにアクセス
2. ニックネームを登録
3. クイズの投稿と回答をテスト

## トラブルシューティング

### データベース接続エラー
- `.env.local` の `POSTGRES_URLCONNECT` が正しく設定されているか確認
- Vercel Postgresのステータスを確認

### CORSエラー
- API Routes は同一オリジンからのリクエストです（CORSは不要）

### Cookie が保存されない
- ブラウザのプライベートモードでないか確認
- ブラウザの Cookie 設定を確認

## 環境変数

Vercelダッシュボード → **Settings** → **Environment Variables** で以下を設定：

| キー                  | 値                 | 説明                        |
| --------------------- | ------------------ | --------------------------- |
| `POSTGRES_URLCONNECT` | `postgresql://...` | Vercel Postgresの接続文字列 |

## プロダクション運用のヒント

1. **バックアップ**: Vercel Postgresの自動バックアップ機能を有効化
2. **モニタリング**: Vercel Analytics を有効化
3. **スケーリング**: 必要に応じてCompute Power を増加
