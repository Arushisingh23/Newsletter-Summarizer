export interface NewsletterSummaryItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  whyItMatters: string;
  source: string;
  readTime: string;
  keyPoints?: string[];
  link?: string;
}

export interface ToolComparison {
  toolName: string;
  category: string;
  jobFitAndAudience: string;
  supportingEvidence: string;
  accessAndPricing: string;
  suggestedFirstTest: string;
  signalScore: number;
  sources: string[];
}

export interface ExcludedStory {
  headline: string;
  source: string;
  reason: string;
}

export interface ExperimentIdea {
  id: string;
  title: string;
  inspiredBy: string;
  coreQuestion: string;
  testProtocol: string;
  expectedSignal: string;
  potentialPostAngle: string;
  status?: 'to_test' | 'in_testing' | 'completed' | 'drafted';
  notes?: string;
  userVerified?: boolean;
}

export interface IndustrySignal {
  trend: string;
  consensus: string;
  recommendedAction: string;
}

export interface IntelligenceBriefing {
  briefingTitle: string;
  editionDate: string;
  executiveSummary: string;
  newslettersProcessedCount: number;
  includedCount: number;
  excludedCount: number;
  excludedStories: ExcludedStory[];
  toolComparisons: ToolComparison[];
  experimentIdeas: ExperimentIdea[];
  topIndustrySignals: IndustrySignal[];
}

export interface RoutineConfig {
  cron: string;
  dayOfWeek: string;
  time: string;
  timeframeDays: number;
  recipientEmail: string;
  gmailLabel: string;
  enabled: boolean;
  lastRunTimestamp?: string;
  nextRunTimestamp?: string;
}

export interface RoutineLog {
  id: string;
  timestamp: string;
  status: 'success' | 'running' | 'failed';
  emailsScanned: number;
  itemsExtracted: number;
  deliveryTarget: string;
  summary: string;
}

export interface ResearchPersona {
  id: string;
  title: string;
  description: string;
  focusQuestion: string;
  prioritize: string;
  leaveOut: string;
}

export interface NewsletterItem {
  id: string;
  sender: string;
  subject: string;
  date: string;
  status: 'included' | 'excluded' | 'duplicate';
  filterReason?: string;
  snippet: string;
  fullContent?: string;
}
