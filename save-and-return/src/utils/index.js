/**
 * Converts state object to a questions array
 * (i.e. from what's stored in the state/session storage to matching webhook output format).
 */
function stateToWebhookQuestions(state) {
  const { progress, exitState, metadata, formPath, ...answers } = state;
  const questionsWithSections = Object.entries(answers).filter(([key, value]) => isObjectWithProperties(value));
  const questionsWithoutSections = Object.entries(answers).filter(([key, value]) => !isObjectWithProperties(value));

  const questions = [];

  questions.push({
    fields: questionsWithoutSections.map(toFields),
  });

  const categories = questionsWithSections.map(([key, value]) => {
    return {
      category: key,
      fields: Object.entries(value).map(toFields),
    };
  });

  questions.push(...categories);

  return questions;
}

/**
 * Converts a question into a field
 * @returns {{answer, key}}
 */
function toFields([key, value]) {
  return {
    key,
    answer: value,
  };
}

function isObjectWithProperties(obj) {
  return typeof obj === "object" && obj !== null && Object.keys(obj).length > 0;
}

module.exports = {
  stateToWebhookQuestions,
  toFields,
  isObjectWithProperties,
};
