export const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  {
    path: '/student/:id',
    name: 'Student',
    component: () => import('../views/Student/Student.vue')
  },
  {
    path: '/students',
    name: 'Students',
    component: () => import('../views/Student/Students.vue')
  }
]
