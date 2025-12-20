import { getOrCreateUserId } from '@/lib/auth';
import { getProfile } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const userId = await getOrCreateUserId();
        const profile = await getProfile(userId);
        return NextResponse.json({ userId, profile });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'ユーザー情報取得に失敗しました' },
            { status: 500 }
        );
    }
}
