FROM node:14-alpine
EXPOSE 3000
WORKDIR /wisfeed-admin

# copy 
COPY /components /wisfeed-admin/components/
COPY /helpers /wisfeed-admin/helpers/
COPY /layouts /wisfeed-admin/layouts/
COPY /modules /wisfeed-admin/modules/
COPY /pages /wisfeed-admin/pages/
COPY /public /wisfeed-admin/public/
COPY /styles /wisfeed-admin/styles/
COPY package.json /wisfeed-admin/package.json
COPY package-lock.json /wisfeed-admin/package-lock.json
COPY .env /wisfeed-admin/.env
COPY jsconfig.json /wisfeed-admin/jsconfig.json
COPY next.config.js /wisfeed-admin/next.config.js
COPY postcss.config.js /wisfeed-admin/postcss.config.js
COPY tailwind.config.js /wisfeed-admin/tailwind.config.js

# build 
RUN npm install
RUN npm run postcss
RUN npm run build

# start app
CMD [ "npm","start" ]