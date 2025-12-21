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