# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate && pnpm i --frozen-lockfile

FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate && pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy runtime assets
COPY --from=build /usr/src/app/uploads ./uploads
EXPOSE 3000
CMD ["node", "dist/main.js"]