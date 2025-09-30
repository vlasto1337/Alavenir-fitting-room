FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm i --omit=dev
RUN npm run build
EXPOSE 4173
CMD npm run preview