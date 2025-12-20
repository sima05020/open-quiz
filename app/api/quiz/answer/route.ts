import { getOrCreateUserId } from '@/lib/auth';
import { getQuizRanking, recordQuizAnswer } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = await getOrCreateUserId();
        const { quizId, openedLetters, answer, correct } = await request.json();

        if (!quizId) {
            return NextResponse.json(
                { error: 'クイズIDが必要です' },
                { status: 400 }
            );
        }

        const result = await recordQuizAnswer(userId, quizId, openedLetters, answer, correct);
        const ranking = await getQuizRanking(quizId);

        return NextResponse.json({
            answer: result.rows[0],
            ranking,
        });
    } catch (error) {
        console.error('Record answer error:', error);
        return NextResponse.json(
            { error: '回答記録に失敗しました' },
            { status: 500 }
        );
    }
}
