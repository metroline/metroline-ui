FROM node:12-alpine AS build

COPY ./ /repo/

WORKDIR /repo

RUN apk add --no-cache git \
  && npm install \
  && npm run build

FROM nginx:1.17-alpine

COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
COPY docker/env.js /env.js

RUN apk --no-cache add \
    bash \
    nodejs \
  && chmod +x /docker-entrypoint.sh /env.js

COPY --from=build /repo/build /www

LABEL maintainer="metroline.io"

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
