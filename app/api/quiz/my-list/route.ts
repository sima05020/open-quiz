import { getOrCreateUserId } from '@/lib/auth';
import { getUserAnsweredQuizzes } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const userId = await getOrCreateUserId();
        const quizzes = await getUserAnsweredQuizzes(userId);
        return NextResponse.json({ quizzes });
    } catch (error) {
        console.error('Get user quizzes error:', error);
        return NextResponse.json(
            { error: 'クイズ一覧取得に失敗しました' },
            { status: 500 }
        );
    }
}
