export function loadCourses(){
  try{
    const raw = localStorage.getItem('am_courses')
    return raw? JSON.parse(raw): []
  }catch{ return [] }
}

export function saveCourses(list:any[]){
  localStorage.setItem('am_courses',JSON.stringify(list))
}

export type LearningBullet = { point: string; explanation: string; question: string }
export type LearningLecture = { id: string; title: string; bullets: (LearningBullet | string)[] }
export type LearningCourse = { id: string; name: string; durationHours: number; skill: string; lectures: LearningLecture[]; createdAt: string }

export function loadLearningCourses(): LearningCourse[] {
  try {
    const raw = localStorage.getItem('am_learning_courses')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveLearningCourses(list: LearningCourse[]) {
  localStorage.setItem('am_learning_courses', JSON.stringify(list))
}
