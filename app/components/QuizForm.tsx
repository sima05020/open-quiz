'use client';

import { useState } from 'react';

interface QuizFormProps {
    onComplete?: () => void;
}

export default function QuizForm({ onComplete }: QuizFormProps) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const VALID_REGEX = /^[ァ-ヴーA-Z0-9]*$/;

    function handleAnswerChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setAnswer(value);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!question || !answer) {
            setError('問題文と答えを入力してください');
            return;
        }

        if (!VALID_REGEX.test(answer)) {
            setError('答えに使用できる文字は全角カタカナ・伸ばし棒・大文字英字・数字のみです');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/quiz/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer }),
            });

            if (!response.ok) {
                throw new Error('投稿に失敗しました');
            }

            setQuestion('');
            setAnswer('');
            setError('投稿しました！');
            onComplete?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
                <label className='block mb-1 text-white'>問題文</label>
                <input
                    type='text'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className='w-full px-2 py-1 border rounded bg-gray-700 text-white border-gray-600'
                />
            </div>

            <div>
                <label className='block mb-1 text-white'>
                    答え（カタカナ・伸ばし棒・大文字英字・数字のみ）
                </label>
                <input
                    type='text'
                    value={answer}
                    onChange={handleAnswerChange}
                    className='w-full px-2 py-1 border rounded bg-gray-700 text-white border-gray-600'
                />
            </div>

            {error && <p className={error.includes('しました') ? 'text-green-500' : 'text-red-500'}>{error}</p>}

            <button
                type='submit'
                className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                disabled={loading}
            >
                {loading ? '投稿中...' : '投稿'}
            </button>
        </form>
    );
}
