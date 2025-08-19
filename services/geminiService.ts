
import { GoogleGenAI, Type } from "@google/genai";
import type { Case, PhishingEmail, SimulationResult, ThreatAnalysisResult } from '../types';
import { Difficulty } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const simulationSchema = {
    type: Type.OBJECT,
    properties: {
        subject: { type: Type.STRING, description: "A dramatic, email-style subject line for the alert. e.g. 'URGENT: Breach Detected - The Phantom Byte Strikes!'" },
        narrative: { type: Type.STRING, description: "A 2-3 paragraph story of the hack. Write in the first-person voice of 'Shadow Hacker', a mysterious and playful cyberpunk Sherlock Holmes. Example: 'The Phantom Byte slipped past your firewall at 2:13 AM… fortunately, I caught him. Let’s reconstruct the crime scene.' Use dramatic but clear language." },
        forensicsReport: {
            type: Type.OBJECT,
            properties: {
                attackTimeline: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A chronological list of 3-5 steps the attacker took." },
                entryPoint: { type: Type.STRING, description: "The specific vulnerability exploited. e.g., 'Unsanitized SQL input on login.php'." },
                dataTargeted: { type: Type.STRING, description: "The specific data the hacker was after. e.g., 'Customer PII and credit card hashes.'" },
                howItWasStopped: { type: Type.STRING, description: "How 'Shadow Hacker' intervened to stop the attack. e.g., 'I severed the database connection and quarantined the malicious process.'" },
                suggestedFixes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 2-3 specific, actionable technical fixes. e.g., 'Implement parameterized queries to prevent SQL injection.'" },
            },
            required: ["attackTimeline", "entryPoint", "dataTargeted", "howItWasStopped", "suggestedFixes"]
        }
    },
    required: ["subject", "narrative", "forensicsReport"]
};

const phishingSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            subject: { type: Type.STRING, description: "The subject line of the email." },
            from: { type: Type.STRING, description: "The 'From' field of the email. For the phishing email, make it look deceptive, e.g., 'IT Support <it-support@co-mpany.com>' with a typo." },
            body: { type: Type.STRING, description: "The body of the email. The phishing email should contain urgency, a suspicious link, and/or grammatical errors." },
            isPhishing: { type: Type.BOOLEAN, description: "Set to true if this is the phishing email, false otherwise." },
        },
        required: ["subject", "from", "body", "isPhishing"]
    }
};

const threatAnalysisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A concise title for the identified threat or vulnerability." },
            description: { type: Type.STRING, description: "A detailed but clear explanation of the threat, its potential impact, and why it's a risk based on the document provided." },
            severity: { type: Type.STRING, enum: ['Critical', 'High', 'Medium', 'Low'], description: "The severity level of the threat." },
            recommendation: { type: Type.STRING, description: "A concrete, actionable recommendation to mitigate or fix the vulnerability." },
        },
        required: ["title", "description", "severity", "recommendation"]
    }
};

export const simulateHack = async (selectedCase: Case, difficulty: Difficulty): Promise<SimulationResult> => {
    try {
        const prompt = `
            You are Shadow Hacker, a mysterious but playful cybersecurity expert. Your tagline is "The only hacker you want breaking in."
            Your personality is like a cyberpunk Sherlock Holmes.

            Generate a simulated hack scenario based on the following case file. The difficulty determines the complexity of the attack.
            
            Case Title: ${selectedCase.title}
            Description: ${selectedCase.description}
            Villain: ${selectedCase.villain}
            Difficulty: ${difficulty}

            Adhere strictly to the JSON schema provided. Your narrative must be in the first-person voice of Shadow Hacker.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: simulationSchema,
                temperature: 0.8,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as SimulationResult;
    } catch (error) {
        console.error("Error simulating hack:", error);
        throw new Error("Failed to get a response from the AI. The digital ghost may be busy.");
    }
};


export const generatePhishingEmails = async (): Promise<PhishingEmail[]> => {
    try {
        const prompt = `
            You are a cybersecurity training assistant. Generate a set of 3 corporate emails for a 'spot the phishing' puzzle.
            - ONE of the emails must be a convincing phishing attempt. It should have tell-tale signs like a sense of urgency, a suspicious sender email, grammatical errors, or a strange link.
            - The OTHER TWO emails must be plausible, legitimate corporate communications.
            - Ensure exactly one email has "isPhishing" set to true.
            - The topics should be common, like HR announcements, IT updates, or a company newsletter.
            - Adhere strictly to the JSON schema provided.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: phishingSchema,
                temperature: 1.0,
            }
        });

        const jsonString = response.text.trim();
        const emails = JSON.parse(jsonString) as PhishingEmail[];
        
        // Ensure there is exactly one phishing email as a fallback
        const phishingCount = emails.filter(e => e.isPhishing).length;
        if (phishingCount !== 1) {
            console.warn("AI did not generate exactly one phishing email. Adjusting manually.");
            return emails.map((email, index) => ({ ...email, isPhishing: index === 0 }));
        }

        return emails;
    } catch (error) {
        console.error("Error generating phishing emails:", error);
        throw new Error("Failed to generate the phishing puzzle. Please try again.");
    }
};

export const analyzeInfrastructureDocument = async (documentText: string): Promise<ThreatAnalysisResult> => {
    try {
        const prompt = `
            You are an expert cybersecurity analyst acting as 'Shadow Hacker'.
            Analyze the following document which details a company's IT infrastructure, architecture, or cybersecurity policies.
            Your task is to identify potential vulnerabilities, misconfigurations, or areas of high risk based *only* on the text provided.
            For each threat you identify, provide a title, a detailed description, a severity level, and a concrete recommendation for mitigation.
            If the document is empty or contains no relevant information, return an empty array.
            Adhere strictly to the JSON schema.

            Document Content:
            ---
            ${documentText}
            ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: threatAnalysisSchema,
                temperature: 0.5,
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as ThreatAnalysisResult;
    } catch (error) {
        console.error("Error analyzing document:", error);
        throw new Error("AI analysis failed. The connection to the digital realm may be unstable.");
    }
};