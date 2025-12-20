import { getOrCreateUserId } from '@/lib/auth';
import { upsertProfile } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const userId = await getOrCreateUserId();
        const { nickname } = await request.json();

        if (!nickname || typeof nickname !== 'string') {
            return NextResponse.json(
                { error: 'ニックネームが必要です' },
                { status: 400 }
            );
        }

        const result = await upsertProfile(userId, nickname);
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Profile upsert error:', error);
        return NextResponse.json(
            { error: 'プロフィール更新に失敗しました' },
            { status: 500 }
        );
    }
}
