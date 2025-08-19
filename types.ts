export interface Case {
  id: string;
  title: string;
  villain: string;
  description: string;
}

export interface ForensicsReport {
  attackTimeline: string[];
  entryPoint: string;
  dataTargeted: string;
  howItWasStopped: string;
  suggestedFixes: string[];
}

export interface SimulationResult {
  subject: string;
  narrative: string;
  forensicsReport: ForensicsReport;
}

export enum Difficulty {
  ROOKIE = "Rookie Hacker",
  OPERATOR = "Cyber Operator",
  ELITE = "Elite Ghost",
}

export enum View {
  DASHBOARD = 'dashboard',
  TRAINING = 'training',
  THREAT_INTEL = 'threat_intel'
}

export interface PhishingEmail {
  subject: string;
  from: string;
  body: string;
  isPhishing: boolean;
}

export interface TutorialStep {
  elementSelector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export type ThreatSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Threat {
  title: string;
  description: string;
  severity: ThreatSeverity;
  recommendation: string;
}

export type ThreatAnalysisResult = Threat[];