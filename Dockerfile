FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

EXPOSE 3001

ENV PORT=3001
CMD ["node", "server.js"]
