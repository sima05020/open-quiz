'use client';

import { useState } from 'react';

interface NicknameFormProps {
    onComplete: () => void;
}

export default function NicknameForm({ onComplete }: NicknameFormProps) {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!nickname) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname }),
            });

            if (!response.ok) {
                throw new Error('登録に失敗しました');
            }

            onComplete();
        } catch (err) {
            setError(err instanceof Error ? err.message : '登録エラーが発生しました');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
            <input
                type='text'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder='ニックネームを入力'
                className='px-2 py-1 border rounded bg-gray-700 text-white border-gray-600'
            />
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
                type='submit'
                className='px-4 py-2 bg-blue-500 rounded hover:bg-blue-600'
                disabled={loading}
            >
                {loading ? '登録中...' : '登録'}
            </button>
        </form>
    );
}
