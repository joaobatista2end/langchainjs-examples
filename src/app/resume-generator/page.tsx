'use client';

import { Tooltip } from '@/components/Tooltip';
import { generateTargetedResume } from '@/utils/create-curriculum';
import { useEffect, useState } from 'react';

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

export default function ResumeGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [formData, setFormData] = useState<FormData>(getEmptyFormData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  const handleClearForm = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
      localStorage.removeItem(STORAGE_KEY);
      setFormData(getEmptyFormData());
      setResult('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error('Erro ao gerar currículo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerador de Currículo Personalizado</h1>
        <button
          type="button"
          onClick={handleClearForm}
          className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
        >
          Limpar Formulário
        </button>
      </div>
      
      <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        Salvamento automático ativado
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Pessoais */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nome Completo</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.personalInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, name: e.target.value }
                })}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="block mb-2">E-mail</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.personalInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, email: e.target.value }
                })}
                placeholder="seu.email@exemplo.com"
              />
            </div>
            <div>
              <label className="block mb-2">Telefone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded"
                value={formData.personalInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, phone: e.target.value }
                })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block mb-2">Cidade</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
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
              <label className="block mb-2">Estado</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
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

        {/* Projetos */}
        <div>
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
              <div key={index} className="border p-4 rounded relative">
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Nome do Projeto</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Link do GitHub</label>
                    <input
                      type="url"
                      className="w-full p-2 border rounded"
                      value={project.githubUrl}
                      onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                      placeholder="https://github.com/seu-usuario/projeto"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Tecnologias Utilizadas</label>
                    <Tooltip type="info" title="Exemplo de tecnologias">
                      Liste as principais tecnologias, frameworks e ferramentas utilizadas no projeto
                    </Tooltip>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={project.technologies}
                      onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                      placeholder="Ex: React, Node.js, MongoDB, Docker"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2">Descrição</label>
                    <textarea
                      className="w-full p-2 border rounded"
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
              className="w-full p-2 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 text-gray-600 hover:text-gray-700"
            >
              + Adicionar Projeto
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Descrição da Vaga</h2>
          <Tooltip type="info" title="Como preencher a descrição da vaga">
            Cole o texto completo da vaga, incluindo requisitos, responsabilidades e diferenciais.
            Quanto mais detalhada for a descrição, melhor será a adaptação do seu currículo.
          </Tooltip>
          <textarea
            className="w-full p-2 border rounded mt-2"
            rows={6}
            value={formData.jobDescription}
            onChange={(e) => setFormData({
              ...formData,
              jobDescription: e.target.value
            })}
            placeholder="Cole aqui a descrição completa da vaga..."
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Seus Dados</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Habilidades Técnicas</label>
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
                className="w-full p-2 border rounded"
                value={formData.userData.skills}
                onChange={(e) => setFormData({
                  ...formData,
                  userData: { ...formData.userData, skills: e.target.value }
                })}
                placeholder="Ex: React, TypeScript, AWS..."
              />
            </div>

            <div>
              <label className="block mb-2">Experiência Relevante</label>
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
                className="w-full p-2 border rounded"
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
              <label className="block mb-2">Principais Conquistas</label>
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
                className="w-full p-2 border rounded"
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
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Habilidades Prioritárias</label>
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
                className="w-full p-2 border rounded"
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
              <label className="block mb-2">Formato</label>
              <Tooltip type="info" title="Tipos de formato">
                <ul className="list-disc ml-4">
                  <li><strong>ATS:</strong> Otimizado para sistemas de recrutamento automático</li>
                  <li><strong>Criativo:</strong> Mais visual e personalizado</li>
                  <li><strong>Técnico:</strong> Foco em detalhes técnicos e projetos</li>
                </ul>
              </Tooltip>
              <select
                className="w-full p-2 border rounded"
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
              <label className="block mb-2">Palavras-chave</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
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
              <label className="block mb-2">Diferencial</label>
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
                className="w-full p-2 border rounded"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Gerando...' : 'Gerar Currículo'}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Currículo Gerado</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 