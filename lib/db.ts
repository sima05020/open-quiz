import { sql } from '@vercel/postgres';

/**
 * プロフィールの作成または更新
 */
export async function upsertProfile(userId: string, nickname: string) {
    return sql`
    INSERT INTO profiles (id, nickname)
    VALUES (${userId}, ${nickname})
    ON CONFLICT (id) DO UPDATE SET nickname = ${nickname}
    RETURNING *;
  `;
}

/**
 * プロフィールの取得
 */
export async function getProfile(userId: string) {
    const result = await sql`
    SELECT * FROM profiles WHERE id = ${userId};
  `;
    return result.rows[0] || null;
}

/**
 * クイズ投稿
 */
export async function createQuizPost(userId: string, question: string, answer: string) {
    return sql`
    INSERT INTO quiz_posts (user_id, question, answer)
    VALUES (${userId}, ${question}, ${answer})
    RETURNING *;
  `;
}

/**
 * ランダムなクイズを取得（未回答のもの）
 */
export async function getRandomQuiz(userId: string) {
    const result = await sql`
    SELECT q.* FROM quiz_posts q
    WHERE q.id NOT IN (
      SELECT quiz_id FROM quiz_answers WHERE user_id = ${userId}
    )
    ORDER BY RANDOM()
    LIMIT 1;
  `;
    return result.rows[0] || null;
}

/**
 * クイズの回答を記録
 */
export async function recordQuizAnswer(
    userId: string,
    quizId: number,
    openedLetters: number,
    answer: string,
    correct: boolean
) {
    return sql`
    INSERT INTO quiz_answers (user_id, quiz_id, opened_letters, answer, correct)
    VALUES (${userId}, ${quizId}, ${openedLetters}, ${answer}, ${correct})
    RETURNING *;
  `;
}

/**
 * ユーザーの回答済みクイズ一覧を取得
 */
export async function getUserAnsweredQuizzes(userId: string) {
    const result = await sql`
    SELECT 
      qa.id,
      qa.quiz_id,
      qa.opened_letters,
      qa.answer,
      qa.correct,
      qa.created_at,
      qp.question,
      qp.answer as correct_answer,
      p.nickname as creator_nickname
    FROM quiz_answers qa
    JOIN quiz_posts qp ON qa.quiz_id = qp.id
    JOIN profiles p ON qp.user_id = p.id
    WHERE qa.user_id = ${userId}
    ORDER BY qa.created_at DESC
    LIMIT 10;
  `;
    return result.rows;
}

/**
 * クイズのランキング（開示文字数が少ない順）
 */
export async function getQuizRanking(quizId: number) {
    const result = await sql`
    SELECT 
      qa.id,
      qa.opened_letters,
      qa.answer,
      qa.correct,
      p.nickname,
      ROW_NUMBER() OVER (ORDER BY qa.opened_letters ASC, qa.created_at ASC) as rank
    FROM quiz_answers qa
    JOIN profiles p ON qa.user_id = p.id
    WHERE qa.quiz_id = ${quizId} AND qa.correct = true
    ORDER BY qa.opened_letters ASC, qa.created_at ASC;
  `;
    return result.rows;
}

/**
 * ユーザーのランキング内順位
 */
export async function getUserRankForQuiz(userId: string, quizId: number) {
    const result = await sql`
    SELECT 
      ROW_NUMBER() OVER (ORDER BY qa.opened_letters ASC, qa.created_at ASC) as rank
    FROM quiz_answers qa
    WHERE qa.quiz_id = ${quizId} AND qa.correct = true AND qa.user_id = ${userId};
  `;
    return result.rows[0]?.rank || 0;
}

/**
 * クイズ投稿情報を取得
 */
export async function getQuizById(quizId: number) {
    const result = await sql`
    SELECT * FROM quiz_posts WHERE id = ${quizId};
  `;
    return result.rows[0] || null;
}
