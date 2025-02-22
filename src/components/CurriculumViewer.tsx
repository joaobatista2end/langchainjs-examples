import { useRef } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';


const markdownStyles = {
  h1: 'text-[14px] font-bold mb-2',
  h2: 'text-[14px] font-semibold mb-2',
  h3: 'text-[14px] font-medium mb-2',
  p: 'text-[12px] mb-2',
  ul: 'list-disc pl-4 mb-2 text-[12px]',
  li: 'mb-1 text-[12px]',
} as const;

export function CurriculumViewer({ content }: CurriculumViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const html2pdf = (await import('html2pdf.js')).default;

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
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <div className="prose prose-sm max-w-none mx-2">
          <ReactMarkdown components={components}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 