# Use Node.js as base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install
RUN npm i -g concurrently

# Copy project files
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

# Install Python 3.9.10
RUN apk add --no-cache python3 py3-pip

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY requirements.txt ./

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
RUN pip install -r requirements.txt

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV PYTHONPATH=/usr/bin/python3

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
