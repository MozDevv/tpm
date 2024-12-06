FROM node:20.5.0-alpine
 
WORKDIR /app
 
COPY  package.json .
 
RUN npm install --legacy-peer-deps
 
COPY . .


RUN npm run build

EXPOSE 3000

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL 
 
CMD ["npm", "start"]


# FROM nginx:alpine
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# COPY --from=builder /app/dist /usr/share/nginx/html
