type Step = {
  title: string;
  description: string;
  content: React.ReactNode;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  isLastStep: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function Stepper({
  steps,
  currentStep,
  onNext,
  onPrev,
  isLastStep,
  onSubmit,
  isSubmitting
}: StepperProps) {
  const handleNextOrSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLastStep) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100">
      {/* Indicador de Progresso */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index <= currentStep ? 'bg-blue-500' : 'bg-gray-700'}
                ${index === currentStep ? 'ring-2 ring-blue-300' : ''}
              `}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className="text-sm mt-2 text-center">
                <div className="font-medium">{step.title}</div>
                <div className="text-gray-400 text-xs">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  h-1 w-full mt-4
                  ${index < currentStep ? 'bg-blue-500' : 'bg-gray-700'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo do Step */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 min-h-[400px]">
        {steps[currentStep].content}
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={handleNextOrSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 disabled:opacity-50"
        >
          {isLastStep ? (isSubmitting ? 'Gerando...' : 'Gerar Currículo') : 'Próximo'}
        </button>
      </div>
    </div>
  );
} 