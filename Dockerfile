# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Install required packages for Arabic text support
RUN apk add --no-cache \
    curl \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Set environment variables for Arabic text support
ENV LANG=ar_SA.UTF-8
ENV LC_ALL=ar_SA.UTF-8
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables (can be overridden at runtime)
ENV OPENROUTER_API_KEY=""
ENV OPENROUTER_MODEL="qwen/qwen2.5-vl-32b-instruct:free"
ENV LLM_TEMPERATURE="0.4"

# Start the application
CMD ["npm", "start"]
