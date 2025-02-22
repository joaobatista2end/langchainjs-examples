import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// 1. Template de Prompt Estratégico
const resumeTemplate = `
INFORMAÇÕES PESSOAIS:
Nome: {name}
E-mail: {email}
Telefone: {phone}
Localização: {city}, {state}

ANÁLISE DA VAGA:
{jobDescription}

DADOS DO CANDIDATO:
- Habilidades Técnicas: {skills}
- Experiência Relevante: {experience}
- Principais Conquistas: {achievements}

PROJETOS RELEVANTES:
{projects}

INSTRUÇÕES PARA GERAÇÃO:
1. Priorize estas competências da vaga: {prioritySkills}
2. Formato solicitado: {format}
3. Palavras-chave obrigatórias: {keywords}

Gere um currículo que:
- Alinhe experiências com requisitos da vaga
- Use métricas concretas (ex: "35% mais rápido")
- Formatação ATS-friendly
- Destaque {differentiator}

Saída (em markdown):
`;

// 2. Configuração do Prompt
const prompt = new PromptTemplate({
  template: resumeTemplate,
  inputVariables: [
    "name",
    "email",
    "phone",
    "city",
    "state",
    "jobDescription",
    "skills",
    "experience",
    "achievements",
    "projects",
    "prioritySkills",
    "format",
    "keywords",
    "differentiator"
  ],
});

// 3. Modelo de Linguagem
if (!process.env.NEXT_PUBLIC_API_KEY_OPENAI) {
  throw new Error('OPENAI_API_KEY não encontrada. Por favor, configure a variável de ambiente.');
}

const model = new ChatOpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_API_KEY_OPENAI,
  temperature: 0.7,
  maxTokens: 1000,
  modelName: "gpt-3.5-turbo",
});

// 4. Função de Geração
export async function generateTargetedResume(
  jobDescription: string,
  userData: {
    skills: string;
    experience: string;
    achievements: string;
    projects: Array<{
      name: string;
      githubUrl: string;
      description: string;
      technologies: string;
    }>;
  },
  config: {
    prioritySkills: string[];
    format: "ATS" | "Criativo" | "Técnico";
    keywords: string[];
    differentiator: string;
  },
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: {
      city: string;
      state: string;
    };
  }
): Promise<string> {
  const projectsText = userData.projects
    .map(p => `- ${p.name} (${p.githubUrl})
    Tecnologias: ${p.technologies}
    ${p.description}`)
    .join('\n');

  const input = await prompt.format({
    name: personalInfo.name,
    email: personalInfo.email,
    phone: personalInfo.phone,
    city: personalInfo.location.city,
    state: personalInfo.location.state,
    jobDescription,
    skills: userData.skills,
    experience: userData.experience,
    achievements: userData.achievements,
    projects: projectsText,
    prioritySkills: config.prioritySkills.join(", "),
    format: config.format,
    keywords: config.keywords.join(", "),
    differentiator: config.differentiator,
  });

  const result = await model.invoke(input);
  return result.content.toString();
}

// Exemplo de uso
const sampleJobDescription = `Desenvolvedor Front-end Sênior (React)
Requisitos:
- 5+ anos com React e TypeScript
- Experiência com otimização de performance
- Conhecimento em testes automatizados (Jest/Cypress)
- Familiaridade com AWS
Diferenciais:
- Projetos escaláveis (>100k usuários)
- Experiência em Fintech`;

const sampleUserData = {
  skills: "React, TypeScript, AWS, Jest, Webpack",
  experience: "Liderança técnica em projeto de pagamentos para 500k usuários",
  achievements: "Redução de 40% no tempo de carregamento através de code splitting",
  projects: [
    {
      name: "Projeto 1",
      githubUrl: "https://github.com/seu-usuario/projeto1",
      description: "Descrição do Projeto 1",
      technologies: "React, TypeScript, AWS, Jest, Webpack"
    },
    {
      name: "Projeto 2",
      githubUrl: "https://github.com/seu-usuario/projeto2",
      description: "Descrição do Projeto 2",
      technologies: "React, TypeScript, AWS, Jest, Webpack"
    }
  ]
};

const sampleConfig = {
  prioritySkills: ["React", "Otimização de Performance", "AWS"],
  format: "ATS" as const,
  keywords: ["escalabilidade", "Fintech", "Web Vitals"],
  differentiator: "Experiência em sistemas de alta escala"
};

const samplePersonalInfo = {
  name: "João Silva",
  email: "joao@example.com",
  phone: "(11) 1234-5678",
  location: {
    city: "São Paulo",
    state: "SP"
  }
};

// Chamada da função
generateTargetedResume(sampleJobDescription, sampleUserData, sampleConfig, samplePersonalInfo)
  .then(result => console.log(result))
  .catch(error => console.error(error));