import type { Case, TutorialStep } from './types';
import { Difficulty } from './types';

export const CASES: Case[] = [
  {
    id: "case-001",
    title: "The Phantom Byte's Phishing Frenzy",
    villain: "Phantom Byte",
    description: "A sophisticated phishing campaign targeting the finance department. Can you uncover the breach before payroll data is compromised?",
  },
  {
    id: "case-002",
    title: "Zero Day Queen's SQL Injection",
    villain: "Zero Day Queen",
    description: "A vulnerable login form is the entry point. The Queen seeks to dump the entire customer database. Time is critical.",
  },
  {
    id: "case-003",
    title: "Trojan Wolf's Brute-Force Barrage",
    villain: "Trojan Wolf",
    description: "Weak admin credentials are being hammered by a distributed brute-force attack. Your firewall and password policies are being put to the test.",
  },
  {
    id: "case-004",
    title: "The Encrypted Payload",
    villain: "Phantom Byte",
    description: "An unknown malware has been planted in the HR system. Decrypt the attacker's trail and identify the weakness in your authentication layer.",
  },
];

export const DIFFICULTIES: Difficulty[] = [
  Difficulty.ROOKIE,
  Difficulty.OPERATOR,
  Difficulty.ELITE,
];

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    elementSelector: 'body',
    position: 'center',
    title: 'Welcome, Agent',
    content: "I'm Shadow Hacker. The digital world is full of ghosts. Let's get you acquainted with the system so you can start hunting them. This is your command center.",
  },
  {
    elementSelector: '#case-panel',
    position: 'right',
    title: 'Step 1: The Case Files',
    content: 'Your assignments are here. Each file details a different threat scenario. Select one to begin your investigation.',
  },
  {
    elementSelector: '#intrusion-panel',
    position: 'left',
    title: 'Step 2: The Simulation Core',
    content: 'This is where the action happens. Once a case is selected, you can set the difficulty and initiate the hack simulation.',
  },
   {
    elementSelector: '#difficulty-selector',
    position: 'bottom',
    title: 'Step 3: Set the Threat Level',
    content: "Choose how hard the villain will fight back. Are you a 'Rookie Hacker' or an 'Elite Ghost'?",
  },
  {
    elementSelector: '#initiate-simulation-btn',
    position: 'bottom',
    title: 'Step 4: Go Live',
    content: "Hit this button to start the simulation. I'll breach the system based on your parameters and report my findings.",
  },
  {
    elementSelector: '#status-panel',
    position: 'left',
    title: 'Step 5: Your Status',
    content: 'This panel tracks your rank and defense scores. As you complete simulations, you will become a Master Defender.',
  },
  {
    elementSelector: '#training-arena-btn',
    position: 'bottom',
    title: 'Step 6: The Training Arena',
    content: 'Need to sharpen your skills? Head to the training arena for interactive puzzles like spotting phishing emails.',
  },
  {
    elementSelector: 'body',
    position: 'center',
    title: 'Briefing Complete',
    content: "You're ready. The system is yours. Remember my motto: I'm the only hacker you want breaking in. Good luck.",
  }
];