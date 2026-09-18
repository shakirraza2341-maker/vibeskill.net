"use client"
import { useState } from 'react'

type Props = { onCreate: (c:any)=>void; isCreating?: boolean }

export default function CourseForm({onCreate,isCreating=false}:Props){
  const [title,setTitle] = useState('')
  const [skill,setSkill] = useState('Intermediate')
  const [count,setCount] = useState(5)

  function submit(e:any){
    e.preventDefault()
    const course = { id: Date.now().toString(), title, skill, count: +count }
    onCreate(course)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="course-form">
      <div className="form-heading"><span className="form-kicker">NEW ROOM</span><h2>What are you<br /><em>preparing for?</em></h2></div>
      <label htmlFor="course-topic">Topic or role</label>
      <input id="course-topic" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Product design, frontend engineering..." required />
      <div className="form-grid">
        <div><label htmlFor="course-skill">Experience level</label><select id="course-skill" value={skill} onChange={e=>setSkill(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Professional</option>
        </select></div>
        <div><label htmlFor="course-count">Questions</label><input id="course-count" type="number" value={count} onChange={e=>setCount(+e.target.value)} min={1} max={20} /></div>
      </div>
      <button className="form-submit" type="submit" disabled={isCreating}><span>{isCreating ? 'Building your room...' : 'Create practice room'}</span><strong aria-hidden="true">↗</strong></button>
    </form>
  )
}
