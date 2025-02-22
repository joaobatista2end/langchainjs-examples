type TooltipProps = {
  type: 'info' | 'tip' | 'warning';
  title?: string;
  children: React.ReactNode;
};

const tooltipIcons = {
  info: '💡',
  tip: '✨',
  warning: '⚠️',
};

export function Tooltip({ type, title, children }: TooltipProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-2">
      <div className="flex items-start gap-2">
        <span className="text-xl">{tooltipIcons[type]}</span>
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-gray-600 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
} 