import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

const USER_ID_COOKIE = 'quiz_user_id';
const MAX_AGE = 365 * 24 * 60 * 60; // 1年

/**
 * ユーザーIDをCookieから取得、なければ新規生成
 */
export async function getOrCreateUserId(): Promise<string> {
    const cookieStore = await cookies();
    let userId = cookieStore.get(USER_ID_COOKIE)?.value;

    if (!userId) {
        userId = randomUUID();
        cookieStore.set(USER_ID_COOKIE, userId, {
            maxAge: MAX_AGE,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
    }

    return userId;
}

/**
 * Cookieからユーザーを取得
 */
export async function getUserIdFromCookie(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(USER_ID_COOKIE)?.value || null;
}
