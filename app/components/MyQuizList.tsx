'use client';

import { useEffect, useState } from 'react';

interface MyQuizRecord {
    id: number;
    quiz_id: number;
    opened_letters: number;
    answer: string;
    correct: boolean;
    created_at: string;
    question: string;
    correct_answer: string;
    creator_nickname: string;
}

interface MyQuizListProps {
    refreshTrigger?: number;
}

export default function MyQuizList({ refreshTrigger }: MyQuizListProps) {
    const [quizzes, setQuizzes] = useState<MyQuizRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchMyQuizzes() {
            setLoading(true);
            try {
                const response = await fetch('/api/quiz/my-list');
                if (!response.ok) throw new Error('取得に失敗しました');
                const data = await response.json();
                setQuizzes(data.quizzes || []);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setQuizzes([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMyQuizzes();
    }, [refreshTrigger]);

    if (loading) return <p className='text-white'>読み込み中...</p>;
    if (quizzes.length === 0) {
        return <p className='text-white'>まだ回答済みのクイズはありません。</p>;
    }

    return (
        <div className='space-y-4'>
            <h3 className='font-bold text-lg text-white'>回答済みクイズ一覧</h3>
            <ol className='list-decimal ml-4 text-white space-y-2'>
                {quizzes.map((q) => (
                    <li key={q.id} className='mb-2'>
                        <div className='text-sm'>
                            <p className='font-semibold text-blue-400'>
                                {q.question}
                            </p>
                            <p className='text-gray-300'>
                                あなたの回答: {q.answer} (開示文字数: {q.opened_letters})
                            </p>
                            <p className='text-gray-400 text-xs'>
                                作成者: {q.creator_nickname} | 正解: {q.correct_answer}
                            </p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
