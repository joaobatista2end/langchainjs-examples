'use client';

import BaseContainer from '@/styleguide/container';
import BaseTextarea from '@/styleguide/textarea';
import { translate } from '@/utils/translate';
import { useState } from 'react';

export default function Home() {
  const [contentToTranslate, setContentToTranslate] = useState('');
  const [translatedContent, setTranslatedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    try {
      setLoading(true);
      const response = await translate(contentToTranslate);
      setTranslatedContent(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <BaseContainer>
          <div className="flex leading-none justify-between items-center border-b border-gray-200 py-4">
            <h1>AI Translation</h1>
            <h2 className="text-sm leading-none text-gray-900/40">
              Translate anything
            </h2>
          </div>
        </BaseContainer>
      </header>

      <main>
        <BaseContainer>
        <p className='mb-12 text-gray-400'>
          This is a simple app to translate content using AI. Just paste the content you want to translate and the translated content will be displayed.
        </p>
          <div className="flex gap-x-4">
            <BaseTextarea
              label="Content for translate"
              value={contentToTranslate}
              onChange={(e) => setContentToTranslate(e.target.value)}
            />
            <BaseTextarea
              label="Content translated"
              value={translatedContent}
              onChange={(e) => setTranslatedContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded"
              onClick={() => handleTranslate() }
            >
              { loading ? 'Wait...' : 'Translate' }
            </button>
          </div>
        </BaseContainer>
      </main>
    </>
  );
}
