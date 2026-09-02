FROM oven/bun:1-alpine

WORKDIR /app
COPY . .

ENV PRSIM_HOST=0.0.0.0
ENV PRSIM_PORT=4173

EXPOSE 4173
CMD ["bun", "run", "start"]
