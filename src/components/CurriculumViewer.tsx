import html2pdf from 'html2pdf.js';
import { useRef } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

type CurriculumViewerProps = {
  content: string;
};

const markdownStyles = {
  h1: 'text-2xl font-bold mb-4',
  h2: 'text-xl font-semibold mb-3',
  h3: 'text-lg font-medium mb-2',
  p: 'mb-4',
  ul: 'list-disc pl-5 mb-4',
  li: 'mb-1',
} as const;

export function CurriculumViewer({ content }: CurriculumViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: 1,
      filename: 'curriculo.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(contentRef.current).save();
  };

  const components: Components = {
    h1: ({ ...props }) => <h1 className={markdownStyles.h1} {...props} />,
    h2: ({ ...props }) => <h2 className={markdownStyles.h2} {...props} />,
    h3: ({ ...props }) => <h3 className={markdownStyles.h3} {...props} />,
    p: ({ ...props }) => <p className={markdownStyles.p} {...props} />,
    ul: ({ ...props }) => <ul className={markdownStyles.ul} {...props} />,
    li: ({ ...props }) => <li className={markdownStyles.li} {...props} />,
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Currículo Gerado</h2>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
        >
          <span>📥</span> Baixar PDF
        </button>
      </div>
      <div 
        ref={contentRef}
        className="bg-white p-8 rounded-lg shadow-md"
      >
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <ReactMarkdown components={components}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 