import { NextResponse } from 'next/server';

// Mock AI Engine Endpoint
// In a real scenario, this would call an LLM or Vision Model (e.g., OpenAI or Gemini)
// to analyze the text and image, and return the criticality, department, and SLA.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, description, imageHash } = body;

    if (!description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock logic based on category
    let criticality = 1; // Medium
    let suggestedDept = 0; // Maintenance
    let estimatedSLAHours = 48;

    const lowerDesc = description.toLowerCase();

    if (category === 'Waterlogging' || lowerDesc.includes('flood') || lowerDesc.includes('water')) {
      criticality = 2; // High
      suggestedDept = 1; // Plumbing
      estimatedSLAHours = 12;
    } else if (category === 'PowerOutage' || lowerDesc.includes('electricity') || lowerDesc.includes('power')) {
      criticality = 3; // Critical
      suggestedDept = 2; // Electrical
      estimatedSLAHours = 4;
    } else if (category === 'LiftBreakdown') {
      criticality = 3; // Critical
      suggestedDept = 3; // Elevator
      estimatedSLAHours = 6;
    } else if (category === 'FireSafety') {
      criticality = 3; // Critical
      suggestedDept = 5; // FireSafety
      estimatedSLAHours = 2;
    }

    return NextResponse.json({
      criticality,
      suggestedDept,
      estimatedSLAHours,
      ai_reasoning: `Based on the keywords and category '${category}', the issue was routed to department ${suggestedDept} with an SLA of ${estimatedSLAHours} hours.`,
    });
  } catch (error) {
    console.error('AI Engine Error:', error);
    return NextResponse.json({ error: 'Failed to process AI analysis' }, { status: 500 });
  }
}
