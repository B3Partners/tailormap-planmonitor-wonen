ARG BUILDPLATFORM=linux/amd64
ARG API_VERSION=snapshot

FROM node:20.13.1 AS builder

ARG BASE_HREF=/
ARG ADD_NG_LIBRARIES
ARG APPEND_NPMRC

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install

COPY . /app

RUN node ./bin/add-ng-libraries.js
RUN npm run build-localized -- --base-href=${BASE_HREF}

FROM --platform=$BUILDPLATFORM ghcr.io/b3partners/tailormap-api:${API_VERSION}

COPY --from=builder /app/dist/app static/
