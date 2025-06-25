ARG BASE_IMAGE_TAG="latest"

FROM digital-form-builder-runner:$BASE_IMAGE_TAG as base

ARG FORMS_DIR="forms"
ARG TRANSFORMS_DIR="transforms"

WORKDIR /usr/src/app
RUN rm -r runner/dist/server/forms && rm -r runner/src
COPY $FORMS_DIR runner/dist/server/forms
COPY $TRANSFORMS_DIR runner/dist/server/transforms

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
