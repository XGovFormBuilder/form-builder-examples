require("crypto");
const runnerClient = require("../../utils/runnerClient");
const { stateToWebhookQuestions } = require("../../utils");

const port = process.env.PORT;
const selfUrl = process.env.SELF_URL ?? `http://localhost:${port ?? 3000}`;

module.exports = async function (fastify, opts) {
  // storing data in memory. You should persist to a database!
  const persistence = {
    webhook: new Map(),
    state: new Map(),
  };

  /**
   * Data POSTed to this endpoint will be stored in memory, and will return an expiry date in 7 days.
   */
  fastify.post("/webhook", async function (request, reply) {
    const { body = {} } = request;
    const { metadata = {} } = body;

    const id = metadata.id ?? crypto.randomUUID();

    if (!metadata?.id) {
      console.log(`setting ${id} to metadata.`);
      metadata.id = id;
      body.metadata = metadata;
    }

    console.log(`received id ${id}, storing:`, body);

    persistence.webhook.set(id, body);

    const dateInSevenDays = new Date();
    dateInSevenDays.setDate(dateInSevenDays.getDay() + 7);

    console.log(`Go to http://localhost:3000/persist/token/webhook/${id} to simulate loading the user's session`);

    // TODO:- The user should be sent an email with instructions on how to log in, or a URL that triggers session initialisation
    console.log(`Sending email to ${body.exitState.exitEmailAddress}...`);

    reply.send({
      expiry: dateInSevenDays.toISOString(),
      // redirectUrl: "..." can also be sent if you want to immediately redirect a user.
    });
  });

  /**
   * Accepts an exit payload in the state format.
   */
  fastify.post("/state", async function (request, reply) {
    const { body } = request;
    const { metadata } = body;

    const id = metadata.id ?? crypto.randomUUID();

    console.log(`received id ${id}, storing:`, body);

    if (!metadata?.id) {
      console.log(`setting ${id} to metadata`);
      metadata.id = id;
      body.metadata = metadata;
    }

    persistence.state.set(id, body);

    console.log(`Go to http://localhost:3000/persist/token/state/${id} to simulate loading the user's session`);

    const dateInSevenDays = new Date();
    dateInSevenDays.setDate(dateInSevenDays.getDay() + 7);

    reply.send({
      expiry: dateInSevenDays.toISOString(),
    });
  });

  /**
   * Going to localhost:3000/token/webhook/:id will
   * 1. Find the user and their WEBHOOK-format data in the "database" matching the :id
   * 2. Initialises their session on the runner
   * 3. Redirects you to the runner, on the page which you exited, with all your saved data
   */
  fastify.get("/token/webhook/:id", async function (request, reply) {
    const userData = persistence.webhook.get(request.params.id);

    if (!userData) {
      console.log("user data could not be found");
      reply.status(404).send();
      return;
    }

    const formPath = `/${userData.formPath}`;
    const redirectPathRelativeToFormPath = userData.exitState.pageExitedOn.substring(formPath.length);

    const initialisedSessionResponseBody = await runnerClient.initialiseSession("exit-webhook", {
      metadata: userData.metadata,
      questions: userData.questions,
      options: {
        callbackUrl: `${selfUrl}/persist/callback`,
        redirectPath: redirectPathRelativeToFormPath,
      },
    });
    const initialisedSessionUrl = runnerClient.getInitialisedSessionUrl(initialisedSessionResponseBody);

    reply.type("text/html").send(
      `
    <html lang="en">
        <body>
            <h1><a href="${initialisedSessionUrl}">Return to your form</a></h1>
        </body>
    </html>
   `
    );
  });

  /**
   * Going to localhost:3000/token/webhook/:id will
   * 1. Find the user and their STATE-format data in the "database" matching the :id
   * 2. Initialises their session on the runner
   * 3. Redirects you to the runner, on the page which you exited, with all your saved data
   */
  fastify.get("/token/state/:id", async function (request, reply) {
    const userData = persistence.state.get(request.params.id);

    if (!userData) {
      console.log("user data could not be found");
      reply.status(404).send();
      return;
    }

    const formPath = `/${userData.formPath}`;
    const redirectPathRelativeToFormPath = userData.exitState.pageExitedOn.substring(formPath.length);

    const questions = stateToWebhookQuestions(userData);

    const initialisedSessionResponseBody = await runnerClient.initialiseSession("exit-state", {
      metadata: userData.metadata,
      questions,
      options: {
        callbackUrl: `${selfUrl}/persist/callback`,
        redirectPath: redirectPathRelativeToFormPath,
      },
    });

    const initialisedSessionUrl = runnerClient.getInitialisedSessionUrl(initialisedSessionResponseBody);

    reply.type("text/html").send(
      `
    <html lang="en">
        <body>
            <h1><a href="${initialisedSessionUrl}">Return to your form</a></h1>
        </body>
    </html>
   `
    );
  });

  fastify.post("/callback", async function (request, reply) {
    console.log("Received a callback from the runner, the user has submitted a form with an initialised session");
    reply.send({});
  });
};
