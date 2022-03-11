FROM node
#Creating app directory
WORKDIR /usr/src/app
#Install full dependencies
#Copying full directory
COPY . .
RUN npm ci
EXPOSE 8080
CMD ["node","index.js"]
