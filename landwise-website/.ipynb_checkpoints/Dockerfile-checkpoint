# Use a base image with essential dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Install required dependencies for node-gyp and canvas
RUN apk add --no-cache \
  python3 \
  py3-pip \
  make \
  g++ \
  cairo \
  pango \
  jpeg-dev \
  giflib-dev \
  librsvg-dev

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev
RUN npm install tailwindcss postcss autoprefixer

# Copy the rest of the app
COPY . .
COPY .env .env

# Build the Next.js app
RUN npm run build

# Use a lightweight production image
FROM node:18-alpine AS runner

WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache \
  cairo \
  pango \
  jpeg \
  giflib \
  librsvg

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env .env

EXPOSE 3000

CMD ["npm", "start"]
