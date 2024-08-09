# Use the official Node.js 20 image as the base image
FROM node:20

# Create and set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Set environment variables (optional, you may want to set these in your docker-compose.yml or deployment platform instead)
# ENV SUPABASE_URL=your_supabase_url
# ENV SUPABASE_KEY=your_supabase_key
# ENV FIREBASE_SERVICE_ACCOUNT_HEX=your_firebase_service_account_hex

# Expose the port that your server will run on
EXPOSE 3500

# Start the application
CMD ["node", "server.js"]
