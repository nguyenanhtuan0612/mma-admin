FROM node:14-alpine
EXPOSE 3000
WORKDIR /mma-admin

# copy 
COPY /components /mma-admin/components/
COPY /helpers /mma-admin/helpers/
COPY /layouts /mma-admin/layouts/
COPY /modules /mma-admin/modules/
COPY /pages /mma-admin/pages/
COPY /public /mma-admin/public/
COPY /styles /mma-admin/styles/
COPY package.json /mma-admin/package.json
COPY package-lock.json /mma-admin/package-lock.json
COPY .env /mma-admin/.env
COPY jsconfig.json /mma-admin/jsconfig.json
COPY next.config.js /mma-admin/next.config.js
COPY postcss.config.js /mma-admin/postcss.config.js
COPY tailwind.config.js /mma-admin/tailwind.config.js

# build 
RUN npm install
RUN npm run postcss
RUN npm run build

# start app
CMD [ "npm","start" ]