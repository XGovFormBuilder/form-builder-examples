# Summary details transformations

If you wish to modify how the details on summary pages are displayed, you can do so by creating summary details transformations.
These transformations allow you to modify the `SummaryViewModel.details` before they are displayed to the user.

Read more about the implementation in the [runner documentation](https://github.com/XGovFormBuilder/digital-form-builder/blob/main/docs/runner/summary-details-transforms.md)

This example shows you how to create a production docker build that includes summary details transformations. Full instructions
for production docker builds can be found in the [production docker build example](./../production-docker/README.md).

This example includes
- A form [forms/test.json](./forms/test.json) 
- A transformation directory, including a [summaryDetails transform](./transforms/summaryDetails/index.js) which uppercases the user's answers 

## Testing
1. Run `docker build -t digital-form-builder-runner:latest .` in this directory
1. Run `docker run -p 3009:3009 digital-form-builder-runner:latest` to start the built image. The runner will be available at localhost:3009. The test form can now be accessed at localhost:3009/test
1. Navigate to [http://localhost:3009/test](http://localhost:3009/test) and fill in the form
1. See that the summary page uppercases all the user's answers
