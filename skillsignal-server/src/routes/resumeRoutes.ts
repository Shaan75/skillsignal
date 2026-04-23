import { Router } from 'express'
import { uploadResume, getResumes, deleteResume, analyzeResumeById, generateCoverLetterById, generateInterviewQuestionsById, matchJobDescriptionById, generateLinkedInBioById, rewriteResumeById, generateSkillGapById, generateATSScoreById, roastResumeById } from '../controllers/resumeController'
import { protect } from '../middleware/authMiddleware'
import { upload } from '../config/multer'

const router = Router()

router.post('/upload', protect, upload.single('resume'), uploadResume)
router.post('/:id/analyze', protect, analyzeResumeById)
router.post('/:id/cover-letter', protect, generateCoverLetterById)
router.post('/:id/interview-questions', protect, generateInterviewQuestionsById)
router.post('/:id/match-job', protect, matchJobDescriptionById)
router.post('/:id/linkedin-bio', protect, generateLinkedInBioById)
router.post('/:id/rewrite', protect, rewriteResumeById)
router.post('/:id/skill-gap', protect, generateSkillGapById)
router.post('/:id/ats-score', protect, generateATSScoreById)
router.post('/:id/roast', protect, roastResumeById)
router.get('/', protect, getResumes)
router.delete('/:id', protect, deleteResume)

export default router