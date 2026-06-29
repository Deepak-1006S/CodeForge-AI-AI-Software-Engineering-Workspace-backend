import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const client = new GoogleGenerativeAI(apiKey);
const model = client.getGenerativeModel({ model: 'gemini-pro' });

export interface GenerateTaskRequest {
  title: string;
  projectContext?: string;
}

export interface ExplainBugRequest {
  bugDescription: string;
  errorStack?: string;
  context?: string;
}

export interface SprintSummaryRequest {
  issues: Array<{ title: string; status: string; description: string }>;
  sprintName?: string;
}

export interface ReleaseNotesRequest {
  version: string;
  features: string[];
  bugFixes: string[];
  improvements: string[];
}

export const generateTaskDescription = async (request: GenerateTaskRequest): Promise<string> => {
  const prompt = `Generate a detailed task description for: "${request.title}".
${request.projectContext ? `Project context: ${request.projectContext}` : ''}

Include:
1. Clear acceptance criteria (as a list)
2. Technical considerations
3. Estimated effort (small/medium/large)
4. Suggested implementation approach

Format the response in markdown.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const explainBug = async (request: ExplainBugRequest): Promise<string> => {
  const prompt = `Analyze and explain the following bug/error:\n\n${request.bugDescription}\n${request.errorStack ? `\nError stack:\n${request.errorStack}` : ''}\n${request.context ? `\nContext:\n${request.context}` : ''}

Provide:
1. Root cause analysis
2. Potential fix approaches (with code examples if applicable)
3. Tests to verify the fix
4. Related areas that might have similar issues

Format the response in markdown.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateSprintSummary = async (request: SprintSummaryRequest): Promise<string> => {
  const issuesText = request.issues
    .map((i) => `- ${i.title} (${i.status})`)
    .join('\n');

  const prompt = `Generate a professional sprint summary for ${request.sprintName || 'the current sprint'}.\n\nCompleted and in-progress issues:\n${issuesText}\n\nInclude:
1. Sprint overview & objectives met
2. Key achievements
3. Blockers and challenges
4. Team productivity metrics (estimated)
5. Recommendations for next sprint

Format the response in markdown.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateReleaseNotes = async (request: ReleaseNotesRequest): Promise<string> => {
  const prompt = `Generate professional release notes for version ${request.version}.\n\nFeatures:\n${request.features.map((f) => `- ${f}`).join('\n')}\n\nBug Fixes:\n${request.bugFixes.map((b) => `- ${b}`).join('\n')}\n\nImprovements:\n${request.improvements.map((i) => `- ${i}`).join('\n')}\n\nInclude:
1. Executive summary
2. Features section with benefits
3. Bug fixes with impact
4. Performance/UX improvements
5. Migration notes (if applicable)
6. Known issues or limitations

Format the response in markdown, suitable for customer-facing documentation.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

