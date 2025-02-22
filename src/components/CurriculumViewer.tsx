import { translateToEnglish } from '@/utils/translate';
import { useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import { Modal } from './Modal';

const markdownStyles = {
  h1: 'text-[14px] font-bold mb-2',
  h2: 'text-[14px] font-semibold mb-2',
  h3: 'text-[14px] font-medium mb-2',
  p: 'text-[12px] mb-2',
  ul: 'list-disc pl-4 mb-2 text-[12px]',
  li: 'mb-1 text-[12px]',
} as const;

type CurriculumViewerProps = {
  content: string;
  isOpen: boolean;
  onClose: () => void;
};

export function CurriculumViewer({ content, isOpen, onClose }: CurriculumViewerProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyContent = async () => {
    const currentContent = translatedContent || content;
    try {
      await navigator.clipboard.writeText(currentContent);
      alert('Conteúdo copiado com sucesso!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar o conteúdo');
    }
  };

  const handleDownloadPDF = async (isEnglish = false) => {
    if (!contentRef.current) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const filename = isEnglish ? 'resume.pdf' : 'curriculo.pdf';

    const opt = {
      margin: 1,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(contentRef.current).save();
  };

  const handleTranslateAndDownload = async () => {
    try {
      setIsTranslating(true);
      const translated = await translateToEnglish(content);
      setTranslatedContent(translated);
      setIsTranslating(false);
      handleDownloadPDF(true);
    } catch (error) {
      console.error('Erro ao traduzir:', error);
      setIsTranslating(false);
    }
  };

  const components: Components = {
    h1: ({ ...props }) => <h1 className={markdownStyles.h1} {...props} />,
    h2: ({ ...props }) => <h2 className={markdownStyles.h2} {...props} />,
    h3: ({ ...props }) => <h3 className={markdownStyles.h3} {...props} />,
    p: ({ ...props }) => <p className={markdownStyles.p} {...props} />,
    ul: ({ ...props }) => <ul className={markdownStyles.ul} {...props} />,
    li: ({ ...props }) => <li className={markdownStyles.li} {...props} />,
  };

  const modalActions = (
    <div className="flex justify-end gap-2">
      <button
        onClick={handleCopyContent}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
      >
        📋 Copiar Conteúdo
      </button>
      <button
        onClick={() => handleDownloadPDF(false)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
      >
        <span>📥</span> Download PDF
      </button>
      <button
        onClick={handleTranslateAndDownload}
        disabled={isTranslating}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 disabled:bg-blue-300"
      >
        {isTranslating ? 'Traduzindo...' : '🌎 Download in English'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visualização do Currículo"
      actions={modalActions}
    >
      <div ref={contentRef} className="bg-white rounded-lg min-h-[60vh]">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown components={components}>
            {translatedContent || content}
          </ReactMarkdown>
        </div>
      </div>
    </Modal>
  );
}
