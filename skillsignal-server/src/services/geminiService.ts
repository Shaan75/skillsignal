import Groq from 'groq-sdk'

export const analyzeResume = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume analyzer. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Analyze this resume and return a JSON object with exactly these fields:
{
  "score": <number 0-100>,
  "skills": [<list of technical and soft skills>],
  "strengths": [<list of 3-5 key strengths>],
  "improvements": [<list of 3-5 specific improvements>],
  "summary": "<2-3 sentence professional summary>"
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const generateCoverLetter = async (resumeText: string, jobDescription: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert career coach and professional cover letter writer. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Write a professional, tailored cover letter based on this resume and job description.

Return a JSON object with exactly this structure:
{
  "coverLetter": "<full cover letter text with proper paragraphs separated by \\n\\n>",
  "matchScore": <number 0-100 indicating how well resume matches job>,
  "keyPoints": [<list of 3-5 key points used from resume that match the job>]
}

Resume:
${resumeText}

Job Description:
${jobDescription}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const generateInterviewQuestions = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert technical interviewer. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Based on this resume, generate 20 interview questions a recruiter would ask THIS specific candidate, with model answers.

Return a JSON object with exactly this structure:
{
  "questions": [
    {
      "question": "<specific interview question>",
      "category": "<Technical|Behavioral|Project|HR>",
      "answer": "<detailed model answer based on the resume>"
    }
  ]
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 4096,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const matchJobDescription = async (resumeText: string, jobDescription: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS and recruitment analyst. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Analyze how well this resume matches the job description.

Return a JSON object with exactly this structure:
{
  "matchScore": <number 0-100>,
  "matchedSkills": [<skills from resume that match the job>],
  "missingSkills": [<important skills in job description not found in resume>],
  "recommendations": [<3-5 specific things to add/change in resume to better match>],
  "verdict": "<one sentence overall verdict>"
}

Resume:
${resumeText}

Job Description:
${jobDescription}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const generateLinkedInBio = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert LinkedIn profile writer and personal branding coach. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Write a compelling LinkedIn "About" section based on this resume.

Return a JSON object with exactly this structure:
{
  "bio": "<full LinkedIn about section, 3-4 paragraphs, professional yet personal tone>",
  "headline": "<catchy LinkedIn headline under 220 characters>",
  "keywords": [<8-10 relevant keywords for LinkedIn SEO>]
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const rewriteResume = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert resume writer. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Rewrite the weak bullet points from this resume into strong, impactful, ATS-friendly statements.

Return a JSON object with exactly this structure:
{
  "rewrites": [
    {
      "original": "<original weak bullet point>",
      "rewritten": "<strong rewritten version with action verbs and metrics>",
      "improvement": "<one line explaining what was improved>"
    }
  ],
  "generalTips": [<3 general tips to improve this resume's language>]
}

Extract 5-8 bullet points from the resume and rewrite them.

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2048,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}
export const generateSkillGap = async (resumeText: string, targetJob: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert career coach and skill development advisor. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Analyze this resume and create a skill gap roadmap for the target job.

Return a JSON object with exactly this structure:
{
  "targetJob": "${targetJob}",
  "readinessScore": <number 0-100>,
  "currentSkills": [<skills from resume relevant to target job>],
  "missingSkills": [
    {
      "skill": "<skill name>",
      "priority": "<High|Medium|Low>",
      "reason": "<why this skill is needed>",
      "resource": "<free learning resource URL or platform name>"
    }
  ],
  "roadmap": [
    {
      "phase": "<Phase 1|Phase 2|Phase 3>",
      "duration": "<e.g. 1-2 months>",
      "focus": "<what to focus on>",
      "skills": [<skills to learn in this phase>]
    }
  ],
  "verdict": "<overall assessment in 1-2 sentences>"
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.4,
    max_tokens: 2048,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export const generateATSScore = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are an expert ATS (Applicant Tracking System) simulator. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Simulate how an ATS system would parse and score this resume.

Return a JSON object with exactly this structure:
{
  "atsScore": <number 0-100>,
  "verdict": "<one sentence ATS verdict>",
  "sections": {
    "contactInfo": <true|false>,
    "summary": <true|false>,
    "experience": <true|false>,
    "education": <true|false>,
    "skills": <true|false>,
    "projects": <true|false>
  },
  "keywordDensity": <number 0-100>,
  "formatIssues": [<list of formatting problems ATS would flag>],
  "missingKeywords": [<important keywords missing for general tech roles>],
  "detectedKeywords": [<keywords ATS successfully detected>],
  "improvements": [<3-5 specific ATS optimization tips>],
  "whatBotSees": "<brief description of how ATS interprets this resume>"
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export const roastResume = async (resumeText: string) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a brutally honest, witty senior software engineer who roasts resumes like a comedy roast. Be funny, savage, but genuinely helpful. Always respond with valid JSON only. No markdown, no extra text.',
      },
      {
        role: 'user',
        content: `Roast this resume brutally but helpfully. Be savage, funny, and specific.

Return a JSON object with exactly this structure:
{
  "overallRoast": "<2-3 sentence brutal opening roast of the entire resume>",
  "roastScore": <number 0-100, lower = more to roast>,
  "burns": [
    {
      "section": "<what section/aspect being roasted>",
      "roast": "<brutal funny roast of this specific thing>",
      "fix": "<what they should actually do to fix it>"
    }
  ],
  "savageLine": "<one absolutely savage one-liner about the resume>",
  "redeeming": "<one genuinely good thing about the resume, said reluctantly>"
}

Resume:
${resumeText}`,
      },
    ],
    temperature: 0.9,
    max_tokens: 2048,
  })

  const content = completion.choices[0].message.content || ''
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}