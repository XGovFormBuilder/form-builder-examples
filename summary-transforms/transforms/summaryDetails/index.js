"use strict";

const summaryDetailsTransformations = {
  test: (details) => {
    // Uppercase all the answers
    return details.map((section) => {
      section.items = section.items.map((item) => {
        return { ...item, value: item.value.toUpperCase() };
      });
      return section;
    });
  },
};

module.exports = summaryDetailsTransformations;
