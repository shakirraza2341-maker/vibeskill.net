import Link from 'next/link'

export default function CourseList({courses, onDelete}:{courses:any[], onDelete:(id:string)=>void}){
  if(!courses || courses.length===0) return <div className="empty-courses"><span>✦</span><div><h3>Your library is waiting.</h3><p>Create your first practice room above and make the next interview feel familiar.</p></div></div>
  return (
    <div className="course-list">
      {courses.map((c,i)=> (
        <article key={c.id} className="course-card">
          <div className="course-card-top"><span className="course-index">{String(i+1).padStart(2, '0')}</span><span className="course-status"><i /> READY TO PRACTICE</span></div>
          <div className="course-card-body"><div><h3>{c.title}</h3><div className="course-meta"><span>{c.skill}</span><span>{c.count} questions</span><span>AI generated</span></div></div><div className="course-arrow" aria-hidden="true">↗</div></div>
          <div className="course-card-actions"><Link className="start-link" href={`/interviews/${c.id}`}>Start interview <span aria-hidden="true">→</span></Link><button className="delete-link" onClick={()=>onDelete(c.id)}>Delete room</button></div>
        </article>
      ))}
    </div>
  )
}
