ARG BASE_IMAGE_TAG="3.26.1-rc.964"

FROM ghcr.io/xgovformbuilder/digital-form-builder-runner:$BASE_IMAGE_TAG as base
ARG FORMS_DIR="forms"
WORKDIR /usr/src/app
RUN rm -r runner/dist/server/forms && rm -r runner/src
COPY runner/src/server/$FORMS_DIR runner/dist/server/forms
COPY runner/config/ runner/config/
COPY runner/src/server/views/ runner/dist/server/views/
COPY runner/src/server/templates runner/dist/server/templates

FROM base as app
WORKDIR /usr/src/app
USER root
RUN deluser --remove-home appuser && \
  addgroup -g 1001 appuser && \
  adduser -S -u 1001 -G appuser appuser
USER appuser

EXPOSE 3009

USER 1001
ENV NODE_ENV=production
CMD [ "yarn", "runner", "start"]
