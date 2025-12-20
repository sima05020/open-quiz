import { getOrCreateUserId } from '@/lib/auth';
import { getRandomQuiz } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const userId = await getOrCreateUserId();
        const quiz = await getRandomQuiz(userId);
        return NextResponse.json({ quiz });
    } catch (error) {
        console.error('Get random quiz error:', error);
        return NextResponse.json(
            { error: 'クイズ取得に失敗しました' },
            { status: 500 }
        );
    }
}
