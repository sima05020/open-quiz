'use client';

import { useCallback, useEffect, useState } from 'react';
import MyQuizList from './components/MyQuizList';
import NicknameForm from './components/NicknameForm';
import QuizForm from './components/QuizForm';
import QuizPlay from './components/QuizPlay';

interface Quiz {
  id: number;
  question: string;
  answer: string;
}

interface User {
  userId: string;
  profile: any;
}

type TabValue = 'top' | 'play' | 'post' | 'mylist';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>('top');
  const [quizPlayState, setQuizPlayState] = useState({
    mode: 'readonly' as 'play' | 'readonly',
    answered: true,
  });
  const [refreshMyList, setRefreshMyList] = useState(0);

  const handleStateChange = useCallback(
    (state: { mode: 'play' | 'readonly'; answered: boolean }) => {
      setQuizPlayState(state);
    },
    []
  );

  // ユーザー情報取得
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('ユーザー情報取得失敗');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // クイズ取得
  async function fetchRandomQuiz() {
    try {
      const response = await fetch('/api/quiz/random');
      if (!response.ok) throw new Error('クイズ取得失敗');
      const data = await response.json();
      setQuiz(data.quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setQuiz(null);
    }
  }

  useEffect(() => {
    if (user?.profile) {
      fetchRandomQuiz();
    }
  }, [user?.profile]);

  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-900 text-white'>
        <p>読み込み中...</p>
      </div>
    );
  }

  // プロフィール未設定
  if (!user?.profile) {
    return (
      <div className='min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6'>
        <h2 className='mb-4 text-xl font-bold'>ニックネームを登録してください</h2>
        <NicknameForm
          onComplete={() => {
            window.location.reload();
          }}
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      {/* ヘッダー */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold'>指定文字オープンクイズ</h1>
          <p className='text-gray-400'>ユーザーID: {user.userId.slice(0, 8)}...</p>
          <p className='text-gray-300'>ユーザーネーム: {user.profile?.nickname}</p>
        </div>
      </div>

      {/* タブ */}
      <div className='mb-6'>
        <div className='flex gap-2 border-b border-gray-700'>
          {[
            { value: 'top', label: 'トップ' },
            { value: 'play', label: 'クイズ挑戦' },
            { value: 'post', label: 'クイズ投稿' },
            { value: 'mylist', label: '回答履歴' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as TabValue)}
              disabled={
                quizPlayState.mode === 'play' && !quizPlayState.answered
              }
              className={`px-4 py-2 border-b-2 transition-colors ${activeTab === tab.value
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                } ${quizPlayState.mode === 'play' && !quizPlayState.answered
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      <div>
        {activeTab === 'top' && (
          <div className='space-y-4'>
            <h2 className='text-xl font-bold'>クイズアプリへようこそ！</h2>
            <p className='text-gray-300'>
              このアプリでは、出題されたクイズに挑戦してランキングを競うことができます。
              <br />
              <br />
              <strong>ルール:</strong>
              <br />
              • 同じクイズに再挑戦はできません
              <br />
              • クイズごとに最大3回まで回答できます
              <br />
              • ランキングは開示文字数が少ないほど上位
            </p>
          </div>
        )}

        {activeTab === 'play' && quiz && (
          <QuizPlay
            quizId={quiz.id}
            question={quiz.question}
            correctAnswer={quiz.answer}
            onCorrect={() => {
              setRefreshMyList((prev) => prev + 1);
            }}
            onNextQuiz={fetchRandomQuiz}
            onStateChange={handleStateChange}
          />
        )}

        {activeTab === 'play' && !quiz && (
          <div className='bg-gray-800 p-4 rounded text-center'>
            <p className='text-gray-400 mb-4'>回答できるクイズがありません...</p>
            <button
              onClick={fetchRandomQuiz}
              className='px-4 py-2 bg-blue-600 rounded hover:bg-blue-700'
            >
              クイズを読み込む
            </button>
          </div>
        )}

        {activeTab === 'post' && (
          <QuizForm
            onComplete={() => {
              setActiveTab('top');
            }}
          />
        )}

        {activeTab === 'mylist' && (
          <MyQuizList refreshTrigger={refreshMyList} />
        )}
      </div>
    </div>
  );
}
