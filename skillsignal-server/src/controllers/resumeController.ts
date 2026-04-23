import { Response } from 'express'
import { AuthRequest } from '../middleware/authMiddleware'
import Resume from '../models/Resume'
import { analyzeResume, generateCoverLetter, generateInterviewQuestions, matchJobDescription, generateLinkedInBio, rewriteResume, generateSkillGap, generateATSScore, roastResume } from '../services/geminiService'
import fs from 'fs'

// @POST /api/resume/upload
export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' })
      return
    }

    const pdfParse = (await import('pdf-parse')).default
    const fileBuffer = fs.readFileSync(req.file.path)
    const pdfData = await pdfParse(fileBuffer)
    const extractedText = pdfData.text

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      extractedText,
      analysis: null,
    })

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume,
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @POST /api/resume/:id/analyze
export const analyzeResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const analysis = await analyzeResume(resume.extractedText)
    resume.analysis = analysis
    await resume.save()

    res.json({ message: 'Analysis complete', analysis })
  } catch (error) {
    console.error('Analyze error:', error)
    res.status(500).json({ message: 'Analysis failed' })
  }
}

// @GET /api/resume
export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ resumes })
  } catch (error) {
    console.error('Get resumes error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @DELETE /api/resume/:id
export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (fs.existsSync(resume.fileUrl)) {
      fs.unlinkSync(resume.fileUrl)
    }

    await resume.deleteOne()
    res.json({ message: 'Resume deleted' })
  } catch (error) {
    console.error('Delete error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}


// @POST /api/resume/:id/cover-letter
export const generateCoverLetterById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body

    if (!jobDescription) {
      res.status(400).json({ message: 'Job description is required' })
      return
    }

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await generateCoverLetter(resume.extractedText, jobDescription)
    res.json(result)
  } catch (error) {
    console.error('Cover letter error:', error)
    res.status(500).json({ message: 'Failed to generate cover letter' })
  }
}
// @POST /api/resume/:id/interview-questions
export const generateInterviewQuestionsById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await generateInterviewQuestions(resume.extractedText)
    res.json(result)
  } catch (error) {
    console.error('Interview questions error:', error)
    res.status(500).json({ message: 'Failed to generate interview questions' })
  }
}
// @POST /api/resume/:id/match-job
export const matchJobDescriptionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body

    if (!jobDescription) {
      res.status(400).json({ message: 'Job description is required' })
      return
    }

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await matchJobDescription(resume.extractedText, jobDescription)
    res.json(result)
  } catch (error) {
    console.error('Job match error:', error)
    res.status(500).json({ message: 'Failed to match job description' })
  }
}
// @POST /api/resume/:id/linkedin-bio
export const generateLinkedInBioById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await generateLinkedInBio(resume.extractedText)
    res.json(result)
  } catch (error) {
    console.error('LinkedIn bio error:', error)
    res.status(500).json({ message: 'Failed to generate LinkedIn bio' })

  }
}
// @POST /api/resume/:id/rewrite
export const rewriteResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await rewriteResume(resume.extractedText)
    res.json(result)
  } catch (error) {
    console.error('Rewrite error:', error)
    res.status(500).json({ message: 'Failed to rewrite resume' })
  }
}
// @POST /api/resume/:id/skill-gap
export const generateSkillGapById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetJob } = req.body

    if (!targetJob) {
      res.status(400).json({ message: 'Target job is required' })
      return
    }

    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await generateSkillGap(resume.extractedText, targetJob)
    res.json(result)
  } catch (error) {
    console.error('Skill gap error:', error)
    res.status(500).json({ message: 'Failed to generate skill gap roadmap' })
  }
}

// @POST /api/resume/:id/ats-score
export const generateATSScoreById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })

    if (!resume) {
      res.status(404).json({ message: 'Resume not found' })
      return
    }

    if (!resume.extractedText) {
      res.status(400).json({ message: 'No text found in resume' })
      return
    }

    const result = await generateATSScore(resume.extractedText)
    res.json(result)
  } catch (error) {
    console.error('ATS score error:', error)
    res.status(500).json({ message: 'Failed to generate ATS score' })
  }
}

// @POST /api/resume/:id/roast
export const roastResumeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id })
    if (!resume) { res.status(404).json({ message: 'Resume not found' }); return }
    if (!resume.extractedText) { res.status(400).json({ message: 'No text found' }); return }
    const result = await roastResume(resume.extractedText)
    res.json(result)
  } catch (error) {
    console.error('Roast error:', error)
    res.status(500).json({ message: 'Failed to roast resume' })
  }
}