# Save and return example

This is a *very* simplified example of save and return. 

The runner itself does not fully implement save and return, but can be configured to allow data to be sent to your APIs.
It is your responsibility to store the data, and allow the user to return to their data (i.e. via email, or login page etc).
The runner has been designed this way so that this feature can be easily used by anyone using the open source project,
and is not bound to any specific implementation, databases, etc.

⚠️ This code is not production ready, and only serves to help you get started and understand the workflow.

This is a node.js server which uses the [https://fastify.dev/](https://fastify.dev/) framework. 
It is similar to express.js, so the code can be easily ported over to help get you started.

This example follows documentation from the runner's [exit feature](https://github.com/XGovFormBuilder/digital-form-builder/blob/main/docs/runner/exit.md), 
and the runner's [session initialisation feature](https://github.com/XGovFormBuilder/digital-form-builder/blob/main/docs/runner/session-initialisation.md).

Read the documentation to understand how your API should interact with the runner.


## Prerequisites

### Docker only
Running via docker will be the simplest way of running both the runner and this api.

- [Docker](https://docs.docker.com/engine/install/)

## Running locally
- Node.js (>=20), use a node manager like [nvm](https://github.com/nvm-sh/nvm) or [n](https://github.com/tj/n) to install node

### Running the project via docker

1. Ensure that your ports 3000 and 3009 are free on your machine.
2. In this directory (save-and-return) run `docker compose up`

### Running the project locally

Start the runner via docker, `docker compose up runner`

#### Running the API locally
1. Run `npm install`
2. Run `npm run dev` or `npm run start`


## Example 

The runner will be running on localhost:3009, and the API will be running on localhost:3000.

The runner is loaded with the forms in [runner/forms](runner/forms)
- [exit-state.json](runner/forms/exit-state.json) - This form is configured to exit with the STATE data format.
- [save-webhook.json](runner/forms/exit-webhook.json) - This form is configured to exit with the WEBHOOK data format.

1. Navigate to [http://localhost:3009/exit-state](http://localhost:3009/exit-state) or [http://localhost:3009/save-webhook](http://localhost:3009/save-webhook)
2. Fill in a page and select "Save and come back later"
3. Enter your email address and continue
4. Your details will be saved on the api, and you will be assigned a uuid.
5. Check the API logs, you should see a log that looks like: "Go to http://localhost:3000/persist/token/webhook/...."
6. Go to this link. You will be sent to a page which has the link "Return to your form". Click on this link
7. You should see the form you filled in, and you can continue filling in the form
8. You will be able to exit again. This time, the metadata will contain the uuid you were assigned earlier

## Endpoints

The code for the endpoints can be found in [src/routes/persist/index.js](src/routes/persist/index.js). Fastify will autoload the routes in the [src/routes](src/routes) directory.

- POST `/persist/webhook`- exit-webhook.json uses this endpoint to save data for users that have exited early. This endpoint will
  1. assign a random UUID to the user (if one does not already exist in the metadata), and store the data in memory
  1. log a message, which links to the GET `/persist/token/webhook/:id` endpoint
  1. respond to the runner with an expiry date 7 days in the future
- POST `/persist/state` - exit-state.json uses this endpoint to save data for users that have exited early. This endpoint will
  1. assign a random UUID to the user (if one does not already exist in the metadata), and store the data in memory
  1. log a message, which links to the GET `/persist/token/state/:id` endpoint
  1. respond to the runner with an expiry date 7 days in the future
- GET `/persist/token/webhook/:id`, `/persist/token/state/:id` these endpoints will
  1. Retrieve the user's data stored in the "database"
  1. Make a call to the runner's `/session/{formId}` endpoints to initialise the sessions
  1. Renders a page, which includes a URL to `${RUNNER_URL}/session/${generatedToken}`. Clicking this link will activate the users session and send them to their form

## Notes, considerations and advisories

### What to do when the user exits a form
You must decide whether you will email the user, or allow them to log into your service, so they can return to their session.

In both cases, after receiving the exit data, it is advisable not to immediately call `/session/{formId}`, and send them the link with the generated token.

These tokens are **single use**. If the user clicks on the link, and lets the session expire without exiting the link,
their data will be lost, they will not be able to use this token again. If email scanners do a GET request on the link, 
it will pre-emptively expire their token.

It is advisable that 
1. You store the user's exit data in your database
2. Set up a page like `/persist/token/:id` that will retrieve the user's data from your database, and call the runner's `/session/{formId}` endpoint.
  - The user will be able to call _your_ `/persist/token/:id` endpoint as many times as they like, which will then call the runner's `/session/{formId}` endpoint
  - You can additionally keep track of how many times the user tries to access _your_ link, and you can send get requests to `/session/{token}` to "expire" old links
  - You may already have a page where users can log in. You can add a "return to your form" link on this page, which will call the runner's `/session/{formId}` endpoint


