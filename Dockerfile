FROM node:lts-alpine AS BUILD_PHASE
WORKDIR /usr/app
# ENV NODE_ENV production
COPY package.json ./
RUN npm install
COPY . .
# CMD [ "npm" ,"run", "build" ]
RUN npm run build




FROM node:lts-alpine
WORKDIR /usr/app
# ENV NODE_ENV production
COPY package.json ./
# RUN npm install --only=production
RUN npm install
COPY --from=BUILD_PHASE /usr/app/dist /usr/app/
# USER node
EXPOSE 3000
CMD [ "npm" ,"run", "start" ]