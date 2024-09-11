**Thank you for considering contributing to Gene UI components! We appreciate the time and effort you invest in making
our project better.**

## Table of Contents

-   [Roadmap](#-roadmap)
-   [Before getting started](#-before-getting-started)
    -   [Feature or Bug: Identifying the issue type](#feature-or-bug)
    -   [Need to update Gene UI components](#need-to-update-gene-ui-components)
-   [Discussing non-public features](#-discussing-non-public-features)
-   [Issue tracking](#-issue-tracking)
-   [Coding](#-coding)
    -   [Tools we use](#tools-we-use)
    -   [File structure](#file-structure)
    -   [Component patterns](#component-patterns)
    -   [Project](#project)
    -   [Environment](#environment)
    -   [CLI](#cli)
-   [How to document](#-how-to-document)
    -   [Component prop guide](#component-prop-guide)
    -   [Write story](#write-story)
-   [Testing](#-testing)
-   [Git flow](#-git-flow)
    -   [Create branch](#create-branch)
    -   [Run commit](#run-commit)
    -   [Create pull request](#create-pull-request)

## 🏁 Roadmap

If you are interested in contributing, we recommend beginning with our list of issues labeled
[good first issue](https://github.com/softconstruct/gene-ui-components/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
Additionally, if you have a feature in mind that you would like to implement, please consult our
[Gene UI Roadmap](https://betconstruct.atlassian.net/jira/software/c/projects/CORE/boards/522/timeline) (accessible to
SoftConstruct staff only) to ensure that the work has not already commenced.

## 👋 Before getting started

## 💬 Discussing non-public features

## 🔎 Issue tracking

### Bug Reports

If you've found a bug in the library, please help us by submitting a detailed bug report. A good bug report includes:

-   A clear and descriptive title.
-   A summary of the issue, including what you expected to happen and what actually happened.
-   Steps to reproduce the issue.
-   Any relevant error messages or screenshots.
-   Information about your environment (e.g., browser version, React version).

### Feature Requests

We welcome suggestions for new features or improvements to existing ones. Before submitting a feature request, please
check if a similar request already exists. If it does, you can add your thoughts or use emoji reactions to express your
interest.

### Issue Labels

We use labels to categorize issues and make it easier for contributors to find areas where they can help. Here are some
labels you might encounter:

#### Types

-   **type / bug**: Something isn't working.
-   **type / feature**: New feature or request.
-   **type / question**: Question.

#### Phases

-   **phase / exploring**: This issue is in the discovery phase.
-   **phase / in-design**: This issue requires design before starting coding.
-   **phase / in-progress**: This issue is in the development process.
-   **phase / review-needed**: This issue is done and needs review.
-   **phase / code-change-requested**: This issue is in progress and after code review requested code changes.
-   **phase / ready-to-go**: This issue merged and will be included in the current milestone release.
-   **phase / shipped**: This issue has already been released, and wait for the closing.

#### General

-   **documentation**: Improvements or additions to documentation.
-   **duplicate**: This issue already exists.
-   **good first issue**: Good for newcomers.
-   **help wanted**: Extra attention is needed.
-   **wontfix**: This will not be worked on.

### Getting Started

1. **Search for Existing Issues**: Before creating a new issue, please search existing issues to ensure that the same or
   similar one does not already exist.

2. **Create a New Issue**: If you couldn't find an existing issue, create a new one. Follow the issue template and
   provide as much detail as possible.

3. **Discuss and Clarify**: Engage in the discussion on your issue. Provide additional details if needed and respond to
   any questions or feedback.

### Closing Issues

Issues will be closed after they have been addressed. If you submitted the issue, please verify that the resolution is
satisfactory and close the issue if it is.

## 🧑‍💻 Coding

[React](#react) [ESLint](#es-lint) [Stylelint](#stylelint) [Prettier](#prettier) [Storybook](#storybook)
[BrowserStack](#browser-stack) [Commitizen](#commitizen) [Rollup](#rollup) [Jest](#jest)

## 📝 How to document

### Component prop guide

A guide for defining component props is essential for maintaining a structured and collaborative codebase. Below is a
guide to defining component props, categorized into different groups to help you and other contributors understand and
use them effectively. Remember to document your props thoroughly, including their types, default values, and
descriptions, to make your components more self-explanatory and maintainable. Good documentation and clear prop
organization are essential for effective collaboration and code maintenance.

#### Content

Content-related props deal with the data and information the component needs to display. These can include text, images,
links, or any other form of content.

-   **title** (string): The title or heading of the component.
-   **text** (string): The main content or body text of the component.
-   **image** (string): The path or URL to an image to display.
-   **link** (string): A link or URL associated with the component.
-   **items** (array): An array of items to be rendered by the component.

```jsx
<MyComponent title="Welcome" text="This is the main content." />
```

#### States

State-related props define the current state or mode of the component. They control how the component behaves in
different scenarios.

-   **`isActive`** (boolean): Indicates whether the component is currently active or not.
-   **`isOpen`** (boolean): Specifies if a modal or dropdown is open.
-   **`isLoading`** (boolean): Flags when data is being fetched or processed.
-   **`error`** (string): Holds an error message when the component is in an error state.

```jsx
<MyComponent isActive={true} isLoading={false} />
```

#### Validations (Forms)

Props related to form components and input validation.

-   **`value`** (string/number): The current value of an input field.
-   **`onChange`** (function): A callback to handle changes to the input field.
-   **`isRequired`** (boolean): Indicates whether the input is required.
-   **`errorText`** (string): Error message to display when validation fails.

```jsx
<InputField value={inputValue} onChange={handleInputChange} isRequired={true} errorText="This field is required." />
```

#### Actions

Action-related props define callbacks or event handlers that the component can trigger.

-   **`onClick`** (function): A function to handle click events.
-   **`onSubmit`** (function): A function to handle form submissions.
-   **`onClose`** (function): A callback to close or hide a component.
-   **`onSelect`** (function): A callback for item selection.

```jsx
<Button onClick={handleClick} />
```

#### Functionality

Functionality props determine how the component works or behaves. These often involve more complex behavior.

-   **`onToggle`** (function): Toggles a feature or aspect of the component.
-   **`onSort`** (function): Sorts items within the component.
-   **`onSearch`** (function): Initiates a search within the component.

```jsx
<MyList onSort={handleSort} onSearch={handleSearch} />
```

#### Appearance

Props related to the visual appearance and styling of the component.

-   **`className`** (string): Additional CSS classes for styling.
-   **`style`** (object): Inline CSS styles to customize the appearance.
-   **`size`** (string): A size indicator for the component (e.g., "small," "medium," "large").
-   **`theme`** (string): A theme or color scheme for the component.

```jsx
<MyComponent className="custom-style" style={{ backgroundColor: 'lightgray' }} size="medium" />
```

#### Others

Additional props that don't fit into the above categories can be included here. Make sure to document these clearly to
avoid confusion.

-   **`customProp`** (any): Custom or component-specific prop.

```jsx
<MyComponent customProp={someValue} />
```

## 🧪 Testing

### Unit and Integration Testing

This guide outlines recommended practices for writing unit and integration tests, following an atomic structure (atoms,
molecules, and organisms). We use [Jest](https://jestjs.io/docs/getting-started) as the testing framework and
[Enzyme](https://enzymejs.github.io/enzyme/) for shallow rendering.

**The benefits of this structured approach ensures**

-   Consistent and maintainable test code.
-   Clear understanding of testing expectations.
-   Easier onboarding for new contributors.

**Testing Philosophy**

-   We focus on testing component behavior based on props and their usage combinations.
-   First of all we should cover regressions using tests in growth process of our library.
-   The states that are used in a component return method that will visualized by the component should be covered with
    test cases.

    ```jsx
    describe('KeyValue', () => {
        let setup: ReactWrapper<IKeyValue>;

        const setState = jest.fn();

        let jestSpy = jest.spyOn(React, 'useState');
        jestSpy.mockImplementation((init) => [init, setState]);

        beforeEach(() => {
            setup = mount(<KeyValue label={'label'} value={'value'} />);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

    	 it('should execute state setter with EXPECDED_VALUE_STATE', () => {
            setup.find('FIND_ELEMENT_WHO_SHOULD_UPDATE_STATE').simulate('click')  ;
            expect(setState).toHaveBeenCalledWith('EXPECDED_VALUE_STATE')  ;
        });
    }
    ```

**Test File**

-   Test file should be located in the component folder.
-   Name should follow this template `ComponentName.test.tsx` e.g. `Button.test.tsx`

**Test File Structure**

1. **Component Setup**

    - Define a [`describe`](https://jestjs.io/docs/api#describename-fn) block for each component, name should be the
      name of the component.
    - Declare a `setup` variable to hold the rendered component instance. Its also should have strict typing.
    - Use [`beforeEach`](https://jestjs.io/docs/api#beforeeachfn-timeout) to render the component using
      [`mount`](https://github.com/enzymejs/enzyme/blob/67b9ebeb3cc66ec1b3d43055c6463a595387fb14/docs/api/mount.md)
      within the setup variable.

        ```jsx
        describe('Button', () => {
            let setup: ReactWrapper<IButtonProps>;

            beforeEach(() => {
                setup = mount(<Button label="Click me" />);
            });
            // ... other unit test cases
        });
        ```

    - The
      [`mount`](https://github.com/enzymejs/enzyme/blob/67b9ebeb3cc66ec1b3d43055c6463a595387fb14/docs/api/ReactWrapper/getWrappingComponent.md)
      function should be used with the second parameter in case you need to use the component in the `provider` or some
      container.

        ```jsx
        describe('ImagePreview', () => {
            let setup: ReactWrapper<IImagePreviewProps>;

            beforeEach(() => {
                setup = mount(<ImagePreview path={path} />, { wrappingComponent: GeneUIProvider });
            });
        });
        ```

2. **Unit testing:**
    - Use [`it`](https://jestjs.io/docs/api#testname-fn-timeout) blocks to define individual unit test cases.
        - Structure
            ```jsx
            it(<description of behavior>, () => {
              // Test code
            });
            ```
        - Description
            - Use clear and concise language that describes the behavior being tested.
            - Start with a verb (e.g., "renders", "should", "handles").
            - Be specific about the component's functionality being tested.
            - Template
                - Props with selective values: `ComponentName should have propValue propName`
                - Props with custom values: `ComponentName renders propName prop correctly`
        - Examples
            - `renders without crashing`: Tests if the component renders without crashing.
            - `renders with required props`: Tests if the component renders correctly when required props are provided.
            - `renders title prop correctly`: Tests if the component renders title prop correctly.
            - `handles user interactions`: Tests if user interactions like clicks, inputs, etc., are handled correctly.
            - `handles prop changes correctly`: Tests if the component reacts as expected when props change.
            - `should have medium size`: Tests if the component accepts passed size prop.
            - `should have title prop` : Tests if the component accepts passed title prop.
            - `should have default props set`: Tests if the component has appropriate default props.
            - `should update state correctly`: Tests if the component updates its state correctly in response to user
              interactions or prop changes.
            - `should initialize state properly`: Tests if the component initializes its state correctly.
        - Positive cases
            - Verify component existence: `expect(setup.exists()).toBeTruthy();`
            - Test props by setting them with `setup.setProps` and asserting their values:
                - Class names: `expect(wrapper.hasClass(className)).toBeTruthy();`
                - Rendered components: `expect(wrapper.find(Icon).exists()).toBeTruthy();`
                - Text content: `expect(wrapper.contains(value)).toBeTruthy();`
            - Test multiple prop values using `it.each` with an array of values.
        - Negative cases
            - Test scenarios where props are missing or incorrect.
            - Use assertions like `toBeFalsy` or `toThrow` to verify expected behavior.
    - The first [`it`](https://jestjs.io/docs/api#testname-fn-timeout) block should always check the component renders
      without crashing.
        ```jsx
        it('renders without crashing', () => {
            expect(setup.exists()).toBeTruthy();
        });
        ```
    - The other [`it`](https://jestjs.io/docs/api#testname-fn-timeout) blocks related with the component specific
      functional but you need to keep the order of them.
        1. Renders without crashing.
        2. Tests blocks for props (positive/negative).
        3. Test blocks for states (positive/negative).
3. **Integration testing**
    - Focus on testing interactions between multiple components.
    - Simulate user interactions and verify expected behavior across components.

**Example (Unit Test)**

```jsx
describe('Button', () => {
    let setup;

    beforeEach(() => {
        setup = mount(<Button label="Click me" />);
    });

    it('renders without crashing', () => {
        expect(setup.exists()).toBeTruthy();
    });

    it('shows the label prop', () => {
        expect(wrapper.text()).toBe('Click me');
    });

    // ... other unit test cases
});
```

**Example (Integration Test)**

```jsx
it('should open modal when button is clicked', () => {
    const onOpen = jest.fn();

    const setup = mount(
        <div>
            <Button onClick={onOpen}>Open Modal</Button>
            <Modal isOpen={onOpen.mock.calls.length > 0} />
        </div>
    );

    setup.find('button').simulate('click');

    expect(onOpen).toHaveBeenCalled();
    expect(setup.find(Modal).prop('isOpen')).toBeTruthy();
});
```

**Example (Portal and Wrapper Test)**

```jsx
it('Tooltip with Portal', () => {
    let setup: ReactWrapper<ITooltipProps>;
    const Component = <Tooltip/>;

    const provider = () => {
         return setup.getWrappingComponent().setProps({
            children: Component
         })
    };

     beforeEach(() => {
        setup = mount(Component, {
            wrappingComponent: GeneUIProvider
        });
    });

    it('renders text prop correctly inside the portal', () => {
        const text = 'Test Tooltip Content';
        setup.setProps({ text, alwaysShow: true });
        expect(provider().text()).toEqual(text);
    });
});
```


## 🚀 Git flow

![image](https://github.com/softconstruct/gene-ui-components/assets/150047343/418bc979-45ed-4fd6-b194-4c32511cbcb4)

In this document, you can find how to name your `feature` or `fix` branch when you need to create a pull request and
which target branch you need to choose for a specific branch. The document is based on the
[semantic versioning specification](https://semver.org/).

#### Main branch

The `main` branch is contain all production version of source code. It means latest release branch source code.

Based on this branch source code build pack, works our CD pipeline.

To this branch need to merge `release/x.x.x` branch, when all issues in the milestone, features and fixes pull requests
are merged to the `release/x.x.x` branch.

#### Release branch creation rules

e.g `release/x.x.x` branch contains all code during the milestone development process and will serve as a target branch
for all features and fixes pull request for current milestone.

Branch is created from `main` branch after prior version release. Release CI pipeline create specific `git tag` for the
version after release.

#### Patch release branch rules

The patch branches are serves to fix some regression and critical issues during milestones development.

e.g `release/2.3.x` branch is patch release branch and `x` is mandatory as we don’t know how much regression and
critical issues we will face during the new milestone development process. This branch will created from `main` with
upcoming release branch but with the `release/2.3.x` name. CI pipeline will increment minor version number with each new
patch release execution.

### Create branch

#### Fix branch creation naming rules

The fix branch should be created under the `fix/` directory and contain the short name of the fix written by the
[kebab case](https://betterprogramming.pub/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841). e.g
`fix/checkbox-group-select-all-option`

When you are going to start fix some bug you need to follow bellow listed steps

1. checkout to the upcoming release branch e.g `git checkout release/2.4.0`
2. then pull from origin e.g `git pull origin release/2.4.0`
3. create new fix branch following the
   [naming rules](https://www.notion.so/GIT-Branch-naming-conventions-and-workflow-b79e0a04b4b143428231c1bdf7073724?pvs=21)
   of fix branch. e.g `git checkout -b fix/checkbox-group-select-all-option`
4. implement the bug fixing code
5. pull from the upcoming milestone release branch and fix some conflicts if they exit. e.g
   `git pull origin release/2.4.0`
6. commit your changes following the
   [commit message rules](https://www.notion.so/GIT-Branch-naming-conventions-and-workflow-b79e0a04b4b143428231c1bdf7073724?pvs=21)
7. push your branch to the origin. e.g `git push -u fix/checkbox-group-select-all-option`
8. create pull request to the upcoming milestone branch. e.g `release/2.4.0`

#### Feature branch creation naming rules

The feature branch should be created under the `feature/` directory and contain the short name of the feature written by
the [kebab case](https://betterprogramming.pub/string-case-styles-camel-pascal-snake-and-kebab-case-981407998841). e.g
`feature/transfer-list`

When you are going to start new feature development you need to follow bellow listed steps

1. checkout to the upcoming release branch e.g `git checkout release/2.4.0`
2. then pull from origin e.g `git pull origin release/2.4.0`
3. create new feature branch following the
   [naming rules](https://www.notion.so/GIT-Branch-naming-conventions-and-workflow-b79e0a04b4b143428231c1bdf7073724?pvs=21)
   of feature branch. e.g `git checkout -b feature/transfer-list`
4. implement functional of the feature
5. pull from the upcoming milestone release branch and fix some conflicts if they exit. e.g
   `git pull origin release/2.4.0`
6. commit your changes following the
   [commit message rules](https://www.notion.so/GIT-Branch-naming-conventions-and-workflow-b79e0a04b4b143428231c1bdf7073724?pvs=21)
7. push your branch to the origin. e.g `git push -u feature/transfer-list`
8. create pull request to the upcoming milestone branch. e.g `release/2.4.0`

### Run commit

We adhere to stringent guidelines regarding the formatting of our Git commit messages. This practice ensures a clear and
**readable project history**, facilitating the generation of a comprehensive **change log** from the branch history.
Additionally, you have two options for composing commit messages: either utilize
[Commitizen](http://commitizen.github.io/cz-cli/) or adhere strictly to our established formatting rules.

When employing [Commitizen](http://commitizen.github.io/cz-cli/), you will be prompted to complete any necessary fields,
and your commit messages will be automatically formatted in accordance with the predefined standards for this project.
To utilize [Commitizen](http://commitizen.github.io/cz-cli/), execute the following command during the commit process:
`npm run commit`

#### **Commit message format**

Each commit in this project must have the following format:

```
<type>(<scope>): <subject>
<body>
<footer>
```

Note: **type** and **subject** are mandatory, the rest are optional

#### **Types**

Must be one of the following:

**feat**: A new feature</br> **fix**: A bug fix</br> **docs**: Documentation only changes</br> **style**: Changes that
do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)</br> **refactor**: A code
change that neither fixes a bug nor adds a feature</br> **perf**: A code change that improves performance</br> **test**:
Adding missing tests or correcting existing tests</br> **build**: Changes that affect the build system or external
dependencies (example scopes: gulp, broccoli, npm)</br> **ci**: Changes to our CI configuration files and scripts
(example scopes: Circle, BrowserStack, SauceLabs)</br> **chore**: Other changes that don't modify src or test files</br>
**revert**: Reverts a previous commit</br>

#### **Scope**

The scope should be the name of the module affected.

#### **Subject**

The subject contains a short description of the change.

#### **Body**

The body contains a longer description of the change. It should include the motivation for the change.

#### **Footer**

The footer should contain any information about **Breaking Changes** and is also the place to reference repository
issues that this commit affects. **Breaking Changes** should start with the word BREAKING CHANGE: with a space or two
newlines. The rest of the commit message is then used for this.

#### **Sample**

```

build(commitizen): add commitlint and husky for linting commit message

The commitlint will lint commit messages and prompt to the contributor if there any errors
```

### Create pull request

When you have successfully done the branch creation and committed your changes it's time to open the pull request.

1. Go to the pull request section.
2. Click on the `New pull request` button.
3. Select the `base` branch, it should be a milestone release branch that your feature or fix will be shipped e.g.
   `release/2.14.0`.
4. Select the compare branch, it should be the branch you created later.
5. Click on the `Create pull request` button.
6. The name of the pull reuqest should match the above specified commit message format e.g.
   `fix(Profile): remove absolute style and change extendTargetWidth value to false`
