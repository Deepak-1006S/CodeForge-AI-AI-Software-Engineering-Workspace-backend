"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStandupReport = exports.generateTaskDescription = exports.generateReleaseNotes = exports.explainBug = exports.generateSprintSummary = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
const ApiError_1 = require("../utils/ApiError");
const MODEL_NAME = 'gemini-1.5-flash';
let genAI = null;
let model = null;
const getModel = () => {
    if (!env_1.env.geminiApiKey) {
        throw new ApiError_1.ApiError(503, 'AI features are not configured. Please contact your administrator.');
    }
    if (!genAI || !model) {
        genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.geminiApiKey);
        model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        });
    }
    return model;
};
const callGemini = async (prompt) => {
    try {
        const geminiModel = getModel();
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text.trim();
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        logger_1.logger.error('Gemini API error:', error);
        if (error instanceof Error) {
            if (error.message.includes('API_KEY_INVALID')) {
                throw new ApiError_1.ApiError(503, 'AI service configuration error. Please contact support.');
            }
            if (error.message.includes('RATE_LIMIT')) {
                throw new ApiError_1.ApiError(429, 'AI service rate limit reached. Please try again in a moment.');
            }
            if (error.message.includes('SAFETY')) {
                throw new ApiError_1.ApiError(400, 'Content was blocked by AI safety filters. Please modify your input.');
            }
        }
        throw new ApiError_1.ApiError(503, 'AI service temporarily unavailable. Please try again later.');
    }
};
const generateSprintSummary = async (issues, projectName, startDate, endDate) => {
    const issueList = issues
        .map((i, idx) => `${idx + 1}. [${i.status}] [${i.priority}] ${i.title}${i.assignedTo ? ` (assigned to: ${i.assignedTo})` : ''}`)
        .join('\n');
    const prompt = `You are a senior engineering manager writing an internal sprint report.

Project: ${projectName}
Sprint Period: ${startDate} to ${endDate}
Total Issues: ${issues.length}

Issues:
${issueList}

Write a comprehensive sprint summary report that includes:
1. **Executive Summary** - 2-3 sentence overview of sprint outcomes
2. **Key Achievements** - Notable completions and wins
3. **Issues by Status** - Breakdown of Done, In Progress, Review, and Todo items
4. **Blockers & Risks** - Identify any high/critical priority unresolved issues
5. **Recommendations** - Actionable next steps for the team

Keep it professional, concise, and data-driven. Format with markdown headings.`;
    return callGemini(prompt);
};
exports.generateSprintSummary = generateSprintSummary;
const explainBug = async (issue) => {
    const prompt = `You are a senior software engineer performing root cause analysis.

Bug Report:
- Title: ${issue.title}
- Priority: ${issue.priority}
- Labels: ${issue.labels?.join(', ') || 'None'}
- Description: ${issue.description || 'No description provided'}

Provide a detailed technical analysis including:
1. **Likely Root Cause** - Most probable technical cause based on the description
2. **Technical Explanation** - Detailed explanation of what might be going wrong
3. **Impact Assessment** - Potential impact on users and system
4. **Debugging Steps** - Step-by-step investigation approach
5. **Suggested Fix** - Concrete technical recommendations to resolve the issue
6. **Prevention** - How to prevent similar bugs in the future

Be technical, specific, and actionable. Format with markdown.`;
    return callGemini(prompt);
};
exports.explainBug = explainBug;
const generateReleaseNotes = async (issues, version) => {
    const completedIssues = issues.filter((i) => i.status === 'Done');
    const issueList = completedIssues
        .map((i, idx) => `${idx + 1}. [${i.priority}] ${i.title}`)
        .join('\n');
    const prompt = `You are a technical writer creating professional software release notes.

Release Version: ${version}
Total Changes: ${completedIssues.length}

Completed Issues:
${issueList || 'No completed issues in this release.'}

Generate professional release notes that include:
1. **Release Version ${version}** - Header with release date
2. **Highlights** - Most impactful changes in this release
3. **New Features** - New functionality added (if any, based on issue titles)
4. **Bug Fixes** - Issues resolved (if any, based on issue titles)
5. **Improvements** - Enhancements and optimizations
6. **Breaking Changes** - Any breaking changes (mention if none)
7. **Upgrade Notes** - Any special instructions for upgrading

Write in a clear, user-friendly tone suitable for both technical and non-technical audiences. Format with markdown.`;
    return callGemini(prompt);
};
exports.generateReleaseNotes = generateReleaseNotes;
const generateTaskDescription = async (title) => {
    const prompt = `You are a senior product manager and software engineer writing detailed task specifications.

Task Title: "${title}"

Generate a comprehensive task description/specification including:
1. **Overview** - Clear description of what needs to be done
2. **Acceptance Criteria** - Specific, testable criteria (use checkbox format: - [ ] criterion)
3. **Technical Requirements** - Technical constraints and implementation notes
4. **Edge Cases** - Important edge cases to handle
5. **Definition of Done** - Clear completion criteria
6. **Estimated Complexity** - Simple/Medium/Complex with brief justification

Be specific, actionable, and thorough. Write as if this is for a production software team. Format with markdown.`;
    return callGemini(prompt);
};
exports.generateTaskDescription = generateTaskDescription;
const generateStandupReport = async (issues, userName) => {
    const inProgress = issues.filter((i) => i.status === 'In Progress');
    const done = issues.filter((i) => i.status === 'Done');
    const blocked = issues.filter((i) => i.priority === 'Critical' && i.status !== 'Done');
    const prompt = `You are ${userName}, a software engineer writing a daily standup update.

Your current work:
- In Progress (${inProgress.length}): ${inProgress.map((i) => i.title).join('; ') || 'None'}
- Completed recently (${done.length}): ${done.map((i) => i.title).join('; ') || 'None'}
- Critical/Blocked (${blocked.length}): ${blocked.map((i) => `${i.title} [${i.status}]`).join('; ') || 'None'}

Write a concise, professional daily standup report in first person with these sections:
1. **Yesterday** - What was completed
2. **Today** - What will be worked on
3. **Blockers** - Any impediments or blockers (be specific if critical issues exist)

Keep it brief (3-5 sentences total), professional, and actionable. No markdown headers needed — write it as natural prose that could be posted in a team Slack channel.`;
    return callGemini(prompt);
};
exports.generateStandupReport = generateStandupReport;
