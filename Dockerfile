FROM node:14-alpine as build
EXPOSE 3000
WORKDIR /mma-admin
COPY . /mma-admin/
COPY .env.prod /mma-admin/.env
RUN npm install
RUN npm run export

FROM nginx:alpine
COPY --from=build /mma-admin/out /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx/nginx.conf /etc/nginx/conf.d
COPY /cert/cert.pem  /etc/letsencrypt/cert.pem
COPY /cert/key.pem /etc/letsencrypt/key.pem
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]