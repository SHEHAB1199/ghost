# Use the official Node.js image.
FROM node:20

# Set the working directory.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Generate Prisma client.
RUN npx prisma generate

# Build the NestJS app.
RUN npm run build

# Expose the port the app runs on.
EXPOSE 8000

# Run the app
CMD ["node", "dist/src/main"]