FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
EXPOSE 4173
CMD npm run preview