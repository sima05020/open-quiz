# クイズシェア

Vercel Postgresを使用したクイズアプリケーション

## 機能

- **クイズ挑戦**: ランダムに表示されるクイズに答える
- **クイズ投稿**: 自分で作成したクイズを投稿
- **ランキング**: 開示文字数が少ないほど上位
- **回答履歴**: 自分の回答済みクイズを確認
- **Cookie認証**: ニックネーム登録のみで利用可能（ログイン不要）

## 技術スタック

- **フロントエンド**: Next.js 16 + React 19 + TailwindCSS
- **バックエンド**: Next.js API Routes
- **データベース**: Vercel Postgres
- **認証**: Cookie ベース（UUID生成）

## セットアップ

### ローカル開発

```bash
# パッケージをインストール
npm install

# 環境変数を設定
# .env.local に POSTGRES_URLCONNECT を設定

# ローカルサーバーを起動
npm run dev
```

`http://localhost:3000` でアプリにアクセス

### Vercelへのデプロイ

[DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

## ファイル構成

```
app/
  api/
    profile/route.ts          # プロフィール管理
    user/route.ts             # ユーザー情報取得
    quiz/
      post/route.ts           # クイズ投稿
      random/route.ts         # ランダムクイズ取得
      answer/route.ts         # 回答記録
      my-list/route.ts        # 回答履歴取得
  components/
    NicknameForm.tsx          # ニックネーム登録
    QuizForm.tsx              # クイズ投稿フォーム
    QuizPlay.tsx              # クイズプレイ画面
    MyQuizList.tsx            # 回答履歴表示
  page.tsx                    # メインページ
lib/
  auth.ts                     # Cookie認証ユーティリティ
  db.ts                       # データベースクエリ
```

## 使い方

1. **初回アクセス**: ニックネームを登録
2. **クイズ挑戦**: 「クイズ挑戦」タブからランダムなクイズに答える
3. **クイズ投稿**: 「クイズ投稿」タブから問題と答えを投稿
4. **回答確認**: 「回答履歴」タブで過去の回答を確認

## データベース

Vercel Postgresを使用。以下のテーブルが必要：

- `profiles`: ユーザー情報（ID、ニックネーム）
- `quiz_posts`: クイズ投稿（ID、出題者ID、問題、答え）
- `quiz_answers`: 回答履歴（ID、回答者ID、クイズID、開示文字数、回答、正否）

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照。

## ライセンス

MIT
