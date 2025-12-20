import { getOrCreateUserId } from '@/lib/auth';
import { createQuizPost } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = await getOrCreateUserId();
        const { question, answer } = await request.json();

        if (!question || !answer) {
            return NextResponse.json(
                { error: '問題文と答えが必要です' },
                { status: 400 }
            );
        }

        // カタカナ + 伸ばし棒 + 大文字英字 + 数字のみ
        const VALID_REGEX = /^[ァ-ヴーA-Z0-9]*$/;
        if (!VALID_REGEX.test(answer)) {
            return NextResponse.json(
                { error: '答えに使用できる文字は全角カタカナ・伸ばし棒・大文字英字・数字のみです' },
                { status: 400 }
            );
        }

        const result = await createQuizPost(userId, question, answer);
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Create quiz error:', error);
        return NextResponse.json(
            { error: 'クイズ投稿に失敗しました' },
            { status: 500 }
        );
    }
}
