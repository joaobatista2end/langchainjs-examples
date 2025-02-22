'use client';

import { CurriculumViewer } from '@/components/CurriculumViewer';
import { Stepper } from '@/components/Stepper';
import { Tooltip } from '@/components/Tooltip';
import { generateTargetedResume } from '@/utils/create-curriculum';
import { useState } from 'react';

type FormatType = "ATS" | "Criativo" | "Técnico";

type Project = {
  name: string;
  githubUrl: string;
  description: string;
  technologies: string;
}

const STORAGE_KEY = 'resume-generator-form';

const getEmptyFormData = () => ({
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
    },
  },
  jobDescription: '',
  userData: {
    skills: '',
    experience: '',
    achievements: '',
    projects: [] as Project[],
  },
  config: {
    prioritySkills: [] as string[],
    format: 'ATS' as FormatType,
    keywords: [] as string[],
    differentiator: '',
  },
});

type FormData = ReturnType<typeof getEmptyFormData>;

const inputStyles = {
  base: "w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
  label: "block mb-2 text-gray-300",
  select: "w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500",
  textarea: "w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500 resize-none",
  button: {
    add: "w-full p-2 border-2 border-dashed border-gray-600 rounded hover:border-gray-500 text-gray-400 hover:text-gray-300 bg-gray-900",
    remove: "absolute top-2 right-2 text-gray-400 hover:text-gray-200"
  },
  projectCard: "border border-gray-700 p-4 rounded relative bg-gray-900"
};

export default function ResumeGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [formData, setFormData] = useState<FormData>(() => {
    // Carrega dados do localStorage apenas na inicialização
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(STORAGE_KEY);
      return savedData ? JSON.parse(savedData) : getEmptyFormData();
    }
    return getEmptyFormData();
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveFormData = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const handleNext = () => {
    saveFormData();
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    saveFormData();
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await generateTargetedResume(
        formData.jobDescription,
        formData.userData,
        {
          ...formData.config,
          format: formData.config.format as FormatType,
          prioritySkills: formData.config.prioritySkills.filter(skill => skill !== ''),
          keywords: formData.config.keywords.filter(keyword => keyword !== ''),
        },
        formData.personalInfo
      );
      setResult(response);
      setIsModalOpen(true);
      saveFormData();
    } catch (error) {
      console.error('Erro ao gerar currículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    setFormData({
      ...formData,
      userData: {
        ...formData.userData,
        projects: [...formData.userData.projects, { 
          name: '', 
          githubUrl: '', 
          description: '',
          technologies: ''
        }],
      },
    });
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...formData.userData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    
    setFormData({
      ...formData,
      userData: {
        ...formData.userData,
        projects: updatedProjects,
      },
    });
  };

  const removeProject = (index: number) => {
    setFormData({
      ...formData,
      userData: {
        ...formData.userData,
        projects: formData.userData.projects.filter((_, i) => i !== index),
      },
    });
  };

  const steps = [
    {
      title: "Informações Pessoais",
      description: "Seus dados básicos",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={inputStyles.label}>Nome Completo</label>
              <input
                type="text"
                className={inputStyles.base}
                value={formData.personalInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value }
                })}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className={inputStyles.label}>E-mail</label>
              <input
                type="email"
                className={inputStyles.base}
                value={formData.personalInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value }
                })}
                placeholder="seu.email@exemplo.com"
              />
            </div>
            <div>
              <label className={inputStyles.label}>Telefone</label>
              <input
                type="tel"
                className={inputStyles.base}
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value }
                })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className={inputStyles.label}>Cidade</label>
              <input
                type="text"
                className={inputStyles.base}
                value={formData.personalInfo.location.city}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: {
                    ...formData.personalInfo,
                    location: { ...formData.personalInfo.location, city: e.target.value }
                  }
                })}
                placeholder="Sua cidade"
              />
            </div>
            <div>
              <label className={inputStyles.label}>Estado</label>
              <input
                type="text"
                className={inputStyles.base}
                value={formData.personalInfo.location.state}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: {
                    ...formData.personalInfo,
                    location: { ...formData.personalInfo.location, state: e.target.value }
                  }
                })}
                placeholder="Seu estado"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vaga",
      description: "Detalhes da posição",
      content: (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Descrição da Vaga</h2>
            <Tooltip type="info" title="Como preencher a descrição da vaga">
              Cole o texto completo da vaga, incluindo requisitos, responsabilidades e diferenciais.
              Quanto mais detalhada for a descrição, melhor será a adaptação do seu currículo.
            </Tooltip>
            <textarea
              className={inputStyles.textarea}
              rows={6}
              value={formData.jobDescription}
              onChange={(e) => setFormData({
                ...formData,
                jobDescription: e.target.value
              })}
              placeholder="Cole aqui a descrição completa da vaga..."
            />
          </div>
        </div>
      )
    },
    {
      title: "Experiência",
      description: "Suas qualificações",
      content: (
        <div className="space-y-4">
          <div>
            <label className={inputStyles.label}>Habilidades Técnicas</label>
            <Tooltip type="tip" title="Exemplo de habilidades técnicas">
              Liste suas habilidades técnicas relevantes para a vaga, como:
              <ul className="list-disc ml-4 mt-1">
                <li>Linguagens: JavaScript, Python, Java</li>
                <li>Frameworks: React, Node.js, Django</li>
                <li>Ferramentas: Git, Docker, AWS</li>
                <li>Metodologias: Scrum, Kanban, TDD</li>
              </ul>
            </Tooltip>
            <input
              type="text"
              className={inputStyles.base}
              value={formData.userData.skills}
              onChange={(e) => setFormData({
                ...formData,
                userData: { ...formData.userData, skills: e.target.value }
              })}
              placeholder="Ex: React, TypeScript, AWS..."
            />
          </div>

          <div>
            <label className={inputStyles.label}>Experiência Relevante</label>
            <Tooltip type="tip" title="Como descrever sua experiência">
              Descreva suas experiências mais relevantes, focando em:
              <ul className="list-disc ml-4 mt-1">
                <li>Responsabilidades principais</li>
                <li>Tamanho das equipes/projetos</li>
                <li>Tecnologias utilizadas</li>
                <li>Impacto no negócio</li>
              </ul>
            </Tooltip>
            <textarea
              className={inputStyles.textarea}
              rows={3}
              value={formData.userData.experience}
              onChange={(e) => setFormData({
                ...formData,
                userData: { ...formData.userData, experience: e.target.value }
              })}
              placeholder="Descreva suas experiências mais relevantes..."
            />
          </div>

          <div>
            <label className={inputStyles.label}>Principais Conquistas</label>
            <Tooltip type="tip" title="Exemplos de conquistas">
              Mencione conquistas mensuráveis, como:
              <ul className="list-disc ml-4 mt-1">
                <li>Redução de 30% no tempo de carregamento da aplicação</li>
                <li>Aumento de 25% na conversão de vendas</li>
                <li>Implementação de sistema usado por 100k+ usuários</li>
                <li>Economia de 40% em custos de infraestrutura</li>
              </ul>
            </Tooltip>
            <textarea
              className={inputStyles.textarea}
              rows={3}
              value={formData.userData.achievements}
              onChange={(e) => setFormData({
                ...formData,
                userData: { ...formData.userData, achievements: e.target.value }
              })}
              placeholder="Liste suas principais conquistas e resultados..."
            />
          </div>
        </div>
      )
    },
    {
      title: "Projetos",
      description: "Trabalhos relevantes",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Projetos Relevantes</h2>
          <Tooltip type="tip" title="Dicas para projetos">
            Destaque projetos que demonstrem suas habilidades técnicas e impacto:
            <ul className="list-disc ml-4 mt-1">
              <li>Projetos profissionais ou pessoais relevantes</li>
              <li>Contribuições para open source</li>
              <li>Projetos acadêmicos significativos</li>
              <li>Hackathons ou desafios técnicos</li>
            </ul>
          </Tooltip>
          <div className="space-y-4">
            {formData.userData.projects.map((project, index) => (
              <div key={index} className={inputStyles.projectCard}>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className={inputStyles.button.remove}
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={inputStyles.label}>Nome do Projeto</label>
                    <input
                      type="text"
                      className={inputStyles.base}
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div>
                    <label className={inputStyles.label}>Link do GitHub</label>
                    <input
                      type="url"
                      className={inputStyles.base}
                      value={project.githubUrl}
                      onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/seu-usuario/projeto"
                    />
                  </div>
                  <div>
                    <label className={inputStyles.label}>Tecnologias Utilizadas</label>
                    <Tooltip type="info" title="Exemplo de tecnologias">
                      Liste as principais tecnologias, frameworks e ferramentas utilizadas no projeto
                    </Tooltip>
                    <input
                      type="text"
                      className={inputStyles.base}
                      value={project.technologies}
                      onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                      placeholder="Ex: React, Node.js, MongoDB, Docker"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={inputStyles.label}>Descrição</label>
                    <textarea
                      className={inputStyles.textarea}
                      rows={2}
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      placeholder="Breve descrição do projeto e seus resultados"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProject}
              className={inputStyles.button.add}
            >
              + Adicionar Projeto
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Configurações",
      description: "Personalização",
      content: (
        <div className="space-y-4">
          <div>
            <label className={inputStyles.label}>Habilidades Prioritárias</label>
            <Tooltip type="info" title="O que são habilidades prioritárias?">
              São as habilidades mais importantes exigidas na vaga. Por exemplo:
              <ul className="list-disc ml-4 mt-1">
                <li>Para vaga fullstack: &quot;React, Node.js, TypeScript&quot;</li>
                <li>Para vaga mobile: &quot;React Native, iOS, Android&quot;</li>
                <li>Para vaga backend: &quot;Java, Spring Boot, Microsserviços&quot;</li>
              </ul>
              Estas habilidades receberão maior destaque no currículo.
            </Tooltip>
            <input
              type="text"
              className={inputStyles.base}
              value={formData.config.prioritySkills.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                config: {
                  ...formData.config,
                  prioritySkills: e.target.value ? e.target.value.split(',').map(s => s.trim()) : []
                }
              })}
              placeholder="Separe as habilidades por vírgula"
            />
          </div>

          <div>
            <label className={inputStyles.label}>Formato</label>
            <Tooltip type="info" title="Tipos de formato">
              <ul className="list-disc ml-4">
                <li><strong>ATS:</strong> Otimizado para sistemas de recrutamento automático</li>
                <li><strong>Criativo:</strong> Mais visual e personalizado</li>
                <li><strong>Técnico:</strong> Foco em detalhes técnicos e projetos</li>
              </ul>
            </Tooltip>
            <select
              className={inputStyles.select}
              value={formData.config.format}
              onChange={(e) => setFormData({
                ...formData,
                config: {
                  ...formData.config,
                  format: e.target.value as FormatType
                }
              })}
            >
              <option value="ATS">ATS</option>
              <option value="Criativo">Criativo</option>
              <option value="Técnico">Técnico</option>
            </select>
          </div>

          <div>
            <label className={inputStyles.label}>Palavras-chave</label>
            <input
              type="text"
              className={inputStyles.base}
              value={formData.config.keywords.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                config: {
                  ...formData.config,
                  keywords: e.target.value ? e.target.value.split(',').map(s => s.trim()) : []
                }
              })}
              placeholder="Separe as palavras-chave por vírgula"
            />
          </div>

          <div>
            <label className={inputStyles.label}>Diferencial</label>
            <Tooltip type="tip" title="Exemplos de diferenciais">
              Escolha um diferencial que te destaque, como:
              <ul className="list-disc ml-4 mt-1">
                <li>Experiência com sistemas de alta escala</li>
                <li>Liderança de equipes internacionais</li>
                <li>Especialização em segurança da informação</li>
                <li>Contribuições para projetos open source</li>
              </ul>
            </Tooltip>
            <input
              type="text"
              className={inputStyles.base}
              value={formData.config.differentiator}
              onChange={(e) => setFormData({
                ...formData,
                config: {
                  ...formData.config,
                  differentiator: e.target.value
                }
              })}
              placeholder="Seu principal diferencial para a vaga"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onNext={handleNext}
          onPrev={handlePrev}
          isLastStep={currentStep === steps.length - 1}
          onSubmit={handleSubmit}
          isSubmitting={loading}
        />
      </form>

      {result && (
        <CurriculumViewer 
          content={result} 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
} 