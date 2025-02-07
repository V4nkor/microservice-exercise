import { sql } from './db.js'

export async function getSchools() {
  const schools = await sql`
    select
      *
    from school
  `
  return schools
}

export async function getSchoolById(id) {
  const school = await sql`
    select
      *
    from school
    where id = ${id}
  `
  return school
}
