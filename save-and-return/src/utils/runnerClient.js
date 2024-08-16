/**
 * This code interacts with the form runner.
 */

const runnerUrl = process.env.RUNNER_URL ?? "http://localhost:3009";

/**
 * @param { string } form - The form id to initialise (i.e. matching the json filename).
 * @param { InitialisationOptions } initialisationOptions
 */
async function initialiseSession(form, initialisationOptions) {
  const requestUrl = `${runnerUrl}/session/${form}`;
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(initialisationOptions),
  });
  const json = await response.json();
  return json;
}

function getInitialisedSessionUrl(responseBody) {
  const sessionUrl = `http://localhost:3009/session/${responseBody.token}`;
  return sessionUrl;
}

module.exports = {
  initialiseSession,
  getInitialisedSessionUrl,
};
