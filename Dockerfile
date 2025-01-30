# FROM node:20.5.0-alpine
FROM node:20.5.0 AS builder
 
WORKDIR /app
 
# COPY  package.json .
COPY package.json package-lock.json ./
 
RUN npm install --legacy-peer-deps
 
COPY . .


# RUN npm run build
 
# EXPOSE 3000
 
# CMD ["npm", "start"]



# Set environment variables for build time
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Build the Next.js application
RUN npm run build

# Use a minimal image for running the application
FROM node:20.5.0 AS runner

# Set the working directory in the container
WORKDIR /app

# Copy the build output and required files from the builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Install only production dependencies
#--production
RUN npm install --legacy-peer-deps

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]




# FROM nginx:alpine
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# COPY --from=builder /app/dist /usr/share/nginx/html
