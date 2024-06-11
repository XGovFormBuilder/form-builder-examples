# Production docker builds

This use case is for when you wish to deploy your form JSONs
and disallow designers from being able to edit your forms. 

The dockerfile will:
1. Use the published open sourced docker image as the base
1. Copy your forms from [./runner/src/server/forms](./runner/src/server/forms) to the base image's /runner/dist/server/forms directory
   1. It will also similarly copy over other views if you wish to customise your error pages or accessibility statements etc.

## Testing
1. Run `docker build -t digital-form-builder-runner:latest .` in this directory
1. Run `docker run -p 3009:3009 -it digital-form-builder-runner:latest` to start the built image. It will be available at localhost:3009. The test form can now be accessed at localhost:3009/example
