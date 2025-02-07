module.exports = {
  apps: [
    {
      name: 'school',
      script: './services/school/index.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      increment_var: 'PORT',
      env: {
        DB_PORT: 5432,
        POSTGRES_USER: 'mmorgat',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_DB: 'school',
        PORT: 3000
      }
    },
    {
      name: 'student',
      script: './services/student/index.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      increment_var: 'PORT',
      env: {
        PORT: 3010
      }
    },
    {
      name: 'auth',
      script: './services/auth/index.js',
      watch: false,
      env: {
        DB_PORT: 5433,
        POSTGRES_USER: 'mmorgat',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_DB: 'user',
        PORT: 3020
      }
    } /* Only one instance can be run -> Not designed as a cluster unlike the others */
  ]
}
