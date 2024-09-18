FROM node:20.5.0-alpine
 
WORKDIR /app
 
COPY  package.json .
 
RUN npm install
 
COPY . .

 
RUN npm run build
 
EXPOSE 3000
 
CMD ["npm", "start"]


# FROM nginx:alpine
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# COPY --from=builder /app/dist /usr/share/nginx/html
