# Built for the backend deployment
# Note: For monorepos, make sure your build context is set to the ROOT of the repository, 
# not the backend folder, so that Docker can copy the shared folder.

FROM node:18-alpine

WORKDIR /app

# Copy the shared package and the backend package from the root context
COPY shared ./shared
COPY backend ./backend

# Move into the backend directory
WORKDIR /app/backend

# Install dependencies including the local shared module
RUN npm install

# Build TypeScript to Javascript
RUN npm run build

# Expose backend API port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
