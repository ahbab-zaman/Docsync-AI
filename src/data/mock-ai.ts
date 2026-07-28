import type { AiResponse, AiActionType, AiSuggestion } from "@/types/ai";

export const mockSuggestions: AiSuggestion[] = [
  {
    id: "sug-1",
    label: "Summarize",
    prompt: "Summarize this document in 3-5 bullet points",
    actionType: "summarize",
  },
  {
    id: "sug-2",
    label: "Action items",
    prompt: "Extract action items from this document",
    actionType: "action-items",
  },
  {
    id: "sug-3",
    label: "Rewrite",
    prompt: "Rewrite this document in a more professional tone",
    actionType: "rewrite",
  },
  {
    id: "sug-4",
    label: "Suggest titles",
    prompt: "Suggest 5 alternative titles for this document",
    actionType: "suggest-titles",
  },
  {
    id: "sug-5",
    label: "Project summary",
    prompt: "Generate a summary of this project based on the document",
    actionType: "project-summary",
  },
  {
    id: "sug-6",
    label: "Expand",
    prompt: "Expand on the selected text with more detail and examples",
    actionType: "expand",
  },
  {
    id: "sug-7",
    label: "Simplify",
    prompt: "Simplify the selected text to make it easier to understand",
    actionType: "simplify",
  },
  {
    id: "sug-8",
    label: "Extract",
    prompt: "Extract key information from the selected text",
    actionType: "extract",
  },
];

const mockResponseContent: Record<AiActionType, string> = {
  summarize:
    "<h3>Document Summary</h3><ul><li>This document covers the key planning and technical details for the current project phase</li><li>Main topics include architecture decisions, implementation priorities, and team responsibilities</li><li>Several action items have been identified with clear owners and deadlines</li><li>This document establishes a foundation for future collaboration and iteration</li><li>Next steps involve implementation, testing, and team review cycles</li></ul>",
  "action-items":
    "<h3>Action Items</h3><ol><li><strong>Finalize architecture decisions</strong> — review and document the chosen patterns</li><li><strong>Set up development environment</strong> — configure tooling and CI pipeline</li><li><strong>Implement core components</strong> — build the primary UI components</li><li><strong>Write tests</strong> — add unit and integration tests for critical paths</li><li><strong>Create documentation</strong> — document setup and usage instructions</li></ol>",
  rewrite:
    "<h3>Rewritten Version</h3><p>This document outlines the strategic direction and technical foundation for the current initiative. The primary objective is to establish a robust architecture that supports both immediate requirements and future scalability. Key decisions have been made regarding technology selection, component design, and team workflow.</p><p>The implementation strategy emphasizes incremental delivery, continuous integration, and thorough testing. Team members have been assigned specific responsibilities with clearly defined milestones.</p><p>Moving forward, regular review cycles will ensure alignment with project goals and facilitate timely adjustments to the plan as needed.</p>",
  expand:
    "<h3>Expanded Version</h3><p>Building on the original content, here is an expanded treatment with additional context, examples, and supporting details:</p><p>This initiative represents a significant step forward in our development process. By establishing clear architecture patterns and component design principles upfront, we reduce technical debt and ensure consistency across the codebase. The technology choices reflect a careful balance between proven stability and modern capabilities.</p><p>Key considerations include scalability for future feature growth, developer experience and onboarding efficiency, maintainability through clear separation of concerns, and performance optimization from the ground up.</p><p>Team collaboration is structured around regular sync points, shared ownership of core components, and a culture of code review and knowledge sharing. This approach ensures that the foundation remains solid as we scale.</p>",
  simplify:
    "<h3>Simplified Version</h3><p>Here is a simpler explanation of the key points:</p><ul><li>We are building a new system with clear goals and a solid plan</li><li>The team has chosen the right tools for the job</li><li>Work is split into small, manageable pieces that can be tested</li><li>Everyone on the team knows what they need to do</li><li>We will check progress regularly and adjust if needed</li></ul><p>Think of it like building a house: we start with a strong foundation, use quality materials, and make sure every part fits together before moving to the next step.</p>",
  extract:
    "<h3>Extracted Information</h3><ul><li><strong>Main Topic:</strong> Project architecture and implementation planning</li><li><strong>Key Decision:</strong> Modular single-repo structure with clear separation of concerns</li><li><strong>Priority Areas:</strong> Core component library, testing infrastructure, documentation</li><li><strong>Team Structure:</strong> Cross-functional collaboration across design, engineering, and product</li><li><strong>Timeline:</strong> Foundation phase first, followed by feature scaling</li><li><strong>Risk Mitigation:</strong> Incremental delivery with regular review cycles</li></ul>",
  "suggest-titles":
    "<h3>Suggested Titles</h3><ol><li><strong>Strategic Blueprint: Architecture and Implementation Guide</strong></li><li><strong>Project Foundation: Technical Decisions and Roadmap</strong></li><li><strong>Building the Core: Architecture, Design, and Delivery</strong></li><li><strong>From Plan to Product: A Technical Implementation Guide</strong></li><li><strong>Engineering Playbook: Architecture, Workflow, and Execution</strong></li></ol>",
  "project-summary":
    "<h3>Project Summary</h3><p><strong>Status:</strong> Active Development</p><p><strong>Key Areas:</strong></p><ul><li>Architecture design and technology selection</li><li>Core component implementation</li><li>Testing and quality assurance</li><li>Documentation and knowledge sharing</li></ul><p><strong>Current Phase:</strong> Foundation — setting up the base structure and core patterns before scaling to full feature set.</p><p><strong>Team:</strong> Cross-functional collaboration with design, engineering, and product.</p><p><strong>Next Milestone:</strong> Complete core component library and establish CI/CD pipeline.</p>",
  custom:
    "<p>Based on your request, here is what I can suggest:</p><p>This document covers several important topics that would benefit from further discussion and refinement. Consider breaking down the larger goals into smaller, actionable tasks that can be completed incrementally.</p><p>Would you like me to help with any specific aspect in more detail?</p>",
};

export function getMockAiResponse(
  actionType: AiActionType,
  _prompt: string,
  _documentContent: string
): AiResponse {
  const id = `ai-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const label = mockSuggestions.find((s) => s.actionType === actionType)?.label ?? "AI Response";
  return {
    id,
    content: mockResponseContent[actionType],
    actionType,
    label,
    timestamp: new Date(),
  };
}
