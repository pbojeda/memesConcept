# Built for the backend deployment
# Note: For monorepos, make sure your build context is set to the ROOT of the repository, 
# not the backend folder, so that Docker can copy the shared folder.

FROM node:18-alpine

WORKDIR /app

# Copy root package.json and lockfile (if available)
COPY package*.json ./

# Copy the shared package and the backend package from the root context
COPY shared ./shared
COPY backend ./backend

# Install dependencies for the whole root workspace
RUN npm install

# Build shared module
WORKDIR /app/shared
RUN npm run build

# Move into the backend directory
WORKDIR /app/backend

# Build TypeScript to Javascript
RUN npm run build

# Expose backend API port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
