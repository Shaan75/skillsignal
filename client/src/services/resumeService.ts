import api from './api'

export const uploadResume = async (file: File) => {
  const formData = new FormData()
  formData.append('resume', file)
  const response = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const getResumes = async () => {
  const response = await api.get('/resume')
  return response.data
}

export const analyzeResume = async (id: string) => {
  const response = await api.post(`/resume/${id}/analyze`)
  return response.data
}

export const deleteResume = async (id: string) => {
  const response = await api.delete(`/resume/${id}`)
  return response.data
}
export const generateCoverLetter = async (id: string, jobDescription: string) => {
  const response = await api.post(`/resume/${id}/cover-letter`, { jobDescription })
  return response.data
}
export const generateInterviewQuestions = async (id: string) => {
  const response = await api.post(`/resume/${id}/interview-questions`)
  return response.data
}
export const matchJob = async (id: string, jobDescription: string) => {
  const response = await api.post(`/resume/${id}/match-job`, { jobDescription })
  return response.data
}
export const generateLinkedInBio = async (id: string) => {
  const response = await api.post(`/resume/${id}/linkedin-bio`)
  return response.data
}
export const rewriteResume = async (id: string) => {
  const response = await api.post(`/resume/${id}/rewrite`)
  return response.data
}
export const generateSkillGap = async (id: string, targetJob: string) => {
  const response = await api.post(`/resume/${id}/skill-gap`, { targetJob })
  return response.data
}
export const generateATSScore = async (id: string) => {
  const response = await api.post(`/resume/${id}/ats-score`)
  return response.data
}
export const roastResume = async (id: string) => {
  const response = await api.post(`/resume/${id}/roast`)
  return response.data
}