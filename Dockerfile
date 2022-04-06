FROM node:14-alpine as build
EXPOSE 3000
WORKDIR /mma-admin
COPY . /mma-admin/
COPY .env.prod /mma-admin/.env
RUN npm install
RUN npm run build
EXPOSE 3000
EXPOSE 3443
CMD [ "node", "server.js" ]