#! FICHIER DEPRECIE, A GARDER POUR HISTORIQUE
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# RUN pnpm run -r build
RUN pnpm deploy --filter=school --prod /usr/src/app/school && pnpm deploy --filter=student --prod /usr/src/app/student

ARG SCHOOL_PORT=3000
ARG STUDENT_PORT=3001

FROM base AS school
COPY --from=build /usr/src/app/school /usr/src/app/school
WORKDIR /usr/src/app/school
EXPOSE ${SCHOOL_PORT}
CMD [ "pnpm", "start" ]

FROM base AS student
COPY --from=build /usr/src/app/student /usr/src/app/student
WORKDIR /usr/src/app/student
EXPOSE ${STUDENT_PORT}
CMD [ "pnpm", "start" ]

# FROM base AS microfront
# COPY --from=build /usr/src/app/microfront /usr/src/app/microfront
# WORKDIR /usr/src/app/microfront
# EXPOSE 3001
# CMD [ "pnpm", "start" ]