type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
};

export function Modal({ isOpen, onClose, children, title, actions }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-[800px] max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 bg-gray-900">
          {children}
        </div>
        {actions && (
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 