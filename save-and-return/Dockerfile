FROM node:20-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install --omit=dev

EXPOSE 3000

USER node
CMD ["npm", "run", "start"]
