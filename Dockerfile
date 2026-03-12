FROM node:22-alpine AS base
WORKDIR /src
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apk add --no-cache openssl3 libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
RUN apk add --no-cache openssl3 libc6-compat git
COPY --from=deps /src/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-alpine AS runner
WORKDIR /src
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache openssl3 libc6-compat

COPY --from=builder /src/public ./public
COPY --from=builder /src/.next/standalone ./
COPY --from=builder /src/.next/static ./.next/static
COPY --from=builder /src/prisma ./prisma
COPY --from=builder /src/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /src/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "server.js"]
