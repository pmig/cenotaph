import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

const analysisTemplate = `You are an expert software engineering analyst. Analyze the following GitHub issue and provide a detailed engineering effort estimation.

Issue Title: {title}
Issue Body: {body}
Labels: {labels}
Number of Comments: {comments}

Please provide your analysis in the following JSON format:
{{
  "summary": "A concise summary of the issue and what needs to be done",
  "estimatedHours": <number between 1-200>,
  "complexity": "Low|Medium|High",
  "requiredSkills": ["skill1", "skill2", ...],
  "potentialChallenges": ["challenge1", "challenge2", ...],
  "suggestedApproach": "A detailed approach to solving this issue"
}}

Ensure your response is valid JSON only, with no additional text. It should not be a json in markdown but plain JSON.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: issueBody, labels, comments } = body;

    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const model = new ChatOpenAI({
      temperature: 1,
      modelName: "gpt-5",
      openAIApiKey,
    });

    const prompt = PromptTemplate.fromTemplate(analysisTemplate);

    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const result = await chain.invoke({
      title: title || "No title provided",
      body: issueBody || "No description provided",
      labels: labels?.join(", ") || "None",
      comments: comments || 0,
    });

    try {
      const analysis = JSON.parse(result);

      if (!analysis.summary || !analysis.estimatedHours || !analysis.complexity ||
          !analysis.requiredSkills || !analysis.potentialChallenges || !analysis.suggestedApproach) {
        throw new Error("Invalid analysis format");
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse AI analysis" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in analyze-issue API:", error);
    return NextResponse.json(
      { error: "Failed to analyze issue" },
      { status: 500 }
    );
  }
}