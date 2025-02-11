# Build stage
FROM node:22-alpine AS build

WORKDIR /src
COPY package.json .

RUN apk add --no-cache openssl3   # or the equivalent OpenSSL package for your Alpine version

RUN openssl version

RUN npm install


COPY . .

RUN npx prisma generate

RUN npm run build

# Production stage
FROM build AS production

COPY --from=build /src/.next ./.next
COPY --from=build /src/node_modules ./node_modules
COPY --from=build /src/package.json ./package.json
COPY --from=build /src/public ./public


EXPOSE 3000
CMD ["npm", "start"]