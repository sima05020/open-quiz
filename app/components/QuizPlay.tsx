'use client';

import { useEffect, useRef, useState } from 'react';

interface RankingEntry {
    rank: number;
    nickname: string;
    opened_letters: number;
    answer: string;
}

interface QuizPlayProps {
    quizId: number;
    question: string;
    correctAnswer: string;
    onCorrect?: (openedCount: number) => void;
    onNextQuiz: () => void;
    onStateChange?: (state: { mode: 'play' | 'readonly'; answered: boolean }) => void;
}

export default function QuizPlay({
    quizId,
    question,
    correctAnswer,
    onCorrect,
    onNextQuiz,
    onStateChange,
}: QuizPlayProps) {
    const [revealed, setRevealed] = useState<boolean[]>([]);
    const [answer, setAnswer] = useState('');
    const [openedCount, setOpenedCount] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [mode, setMode] = useState<'play' | 'readonly'>('play');
    const [attempts, setAttempts] = useState(0);
    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isLeavingRef = useRef(false);

    const VALID_REGEX = /^[ァ-ヴーA-Z0-9]*$/;

    useEffect(() => {
        setRevealed(Array.from(question).map(() => false));
        setOpenedCount(0);
        setAnswer('');
        setAnswered(false);
        setAttempts(0);
        setMode('play');
        setResultMessage(null);
        setError(null);
        isLeavingRef.current = false;
    }, [quizId, question]);

    function handleReveal(idx: number) {
        if (answered || mode === 'readonly') return;
        if (!revealed[idx]) {
            const newRevealed = [...revealed];
            newRevealed[idx] = true;
            setRevealed(newRevealed);
            setOpenedCount((c) => c + 1);
        }
    }

    async function handleSubmit() {
        if (!quizId) return;
        if (mode !== 'play' || answered) return;

        if (!VALID_REGEX.test(answer)) {
            setError('使用できない文字が含まれています');
            return;
        }

        if (answer !== correctAnswer) {
            if (attempts >= 2) {
                setAnswered(true);
                setMode('readonly');
                setResultMessage('不正解（3回目）');

                // 不正解を記録
                await fetch('/api/quiz/answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizId,
                        openedLetters: openedCount,
                        answer,
                        correct: false,
                    }),
                });
            } else {
                setAttempts(attempts + 1);
                setError(`不正解です。残り${3 - attempts - 1}回です`);
                setAnswer('');
            }
            return;
        }

        // 正解
        try {
            const response = await fetch('/api/quiz/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quizId,
                    openedLetters: openedCount,
                    answer,
                    correct: true,
                }),
            });

            if (!response.ok) throw new Error('回答記録に失敗しました');

            const data = await response.json();
            setRanking(data.ranking || []);

            onCorrect?.(openedCount);
            setAnswered(true);
            setMode('readonly');
            setResultMessage('正解！');
            setRevealed(Array.from(question).map(() => true));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        }
    }

    useEffect(() => {
        onStateChange?.({ mode, answered });
    }, [mode, answered, onStateChange]);

    return (
        <div className='space-y-4 text-white'>
            <div className='bg-gray-800 p-4 rounded'>

                {mode === 'play' && !answered && (
                    <div className='mb-4'>
                        <p className='text-sm text-gray-400 mb-2'>
                            文字をクリックして開示 (開示数: {openedCount})
                        </p>
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {Array.from(question).map((char, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleReveal(idx)}
                                    className={`w-10 h-10 rounded font-bold ${revealed[idx]
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-600 text-gray-400'
                                        }`}
                                >
                                    {revealed[idx] ? char : '?'}
                                </button>
                            ))}
                        </div>

                        <input
                            type='text'
                            value={answer}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                                setError(null);
                            }}
                            placeholder='答えを入力'
                            className='w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 mb-2'
                        />

                        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

                        <button
                            onClick={handleSubmit}
                            className='w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'
                        >
                            回答する
                        </button>
                    </div>
                )}

                {resultMessage && (
                    <div className='mb-4 p-3 bg-gray-700 rounded text-center'>
                        <p className={resultMessage === '正解！' ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>
                            {resultMessage}
                        </p>
                    </div>
                )}

                {ranking.length > 0 && (
                    <div className='mb-4'>
                        <h4 className='font-bold mb-2'>ランキング（正解者）</h4>
                        <ol className='list-decimal ml-4 text-sm space-y-1'>
                            {ranking.slice(0, 5).map((entry) => (
                                <li key={entry.rank} className='text-gray-300'>
                                    {entry.rank}位: {entry.nickname} ({entry.opened_letters}字開示)
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {mode === 'readonly' && (
                    <div className='flex gap-2'>
                        <button
                            onClick={onNextQuiz}
                            className='flex-1 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700'
                        >
                            次のクイズへ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
