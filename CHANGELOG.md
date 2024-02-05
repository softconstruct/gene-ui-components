# Changelog

## [2.12.3](https://github.com/softconstruct/gene-ui-components/compare/v2.12.2...v2.12.3) (2024-02-05)


### Bug Fixes

* **Package:** remove side effects from package.json and rollup config ([8ccbb41](https://github.com/softconstruct/gene-ui-components/commit/8ccbb4100d31265d7e6b52f439796037f1256019))
* **Portal:** add optional chaining for provider ref ([cda1f02](https://github.com/softconstruct/gene-ui-components/commit/cda1f026b28566dbfcdd6a9fb7f5c8834e29f3ff))

# 2.12.2 (2024-02-02)

### Bug Fixes

-   **PopoverV2:** rmove to up container parent ref
    definition([#50](https://github.com/softconstruct/gene-ui-components/issues/50))
-   **Widget:** add support headerActions prop functional for compact
    type([#54](https://github.com/softconstruct/gene-ui-components/issues/54))
-   **ValidatableNumberInput:** clear bad values of
    input([#51](https://github.com/softconstruct/gene-ui-components/issues/51))
-   **ExtendedInput:** focus event logic input([#52](https://github.com/softconstruct/gene-ui-components/issues/52))
-   **Dropdown:** default value falsy case input([#53](https://github.com/softconstruct/gene-ui-components/issues/53))

# 2.12.1 (2024-01-11)

### Bug Fixes

-   **CommitMessage:** disable scope lowercase functional in the git-cz package
    ([#46](https://github.com/softconstruct/gene-ui-components/issues/46))
    ([120bebe](https://github.com/softconstruct/gene-ui-components/commit/120bebe883430c04ebd8b0aea09408809a3f8e3a))
-   **Component-stage:** fix and improve component-stage
    ([b244edb](https://github.com/softconstruct/gene-ui-components/commit/b244edbdaca3d1d3415df8c59a15cef51d7dbbbe))
-   **DatePickerInput:** close picker popover after value selection
    ([#48](https://github.com/softconstruct/gene-ui-components/issues/48))
    ([e58be53](https://github.com/softconstruct/gene-ui-components/commit/e58be53709630eb00cacf089c767c91aa3021675))
-   **Dropdown:** input truncated text blinking fix
    ([#37](https://github.com/softconstruct/gene-ui-components/issues/37))
    ([19f4e54](https://github.com/softconstruct/gene-ui-components/commit/19f4e54bb3fb37d6acefd7e55480ea82dba9c5a7))
-   **Dropdown:** open by tab key will autofocus to searhc input
    ([d2a130b](https://github.com/softconstruct/gene-ui-components/commit/d2a130bbf65dfa8b47337fd4df8f91ec44ec7efa))
-   **Dropdown:** remove Dropdown search input autofocus
    ([be5b4e6](https://github.com/softconstruct/gene-ui-components/commit/be5b4e6802a31545f6fca86b2bfcd1959e1cf003))
-   **Module:** remove undefined modules exports from the library entry point
    ([c2d32c2](https://github.com/softconstruct/gene-ui-components/commit/c2d32c2c68924477957f8016c79a67522d623b9c))
-   **Stories:** import and export changes
    ([896ce5c](https://github.com/softconstruct/gene-ui-components/commit/896ce5c2484c03a5fd020991f0c5757e0203dae1))
-   **Theming:** dark and light mode fix
    ([a7c3c24](https://github.com/softconstruct/gene-ui-components/commit/a7c3c2461614e6f810d67eee13e0b50ec6de969e))
-   **Version-select:** version select container fix
    ([e57c363](https://github.com/softconstruct/gene-ui-components/commit/e57c3635ee8d0d3422c9db82f6bb6d151e040a10))

### Features

-   **Addon-jest:** add test addon to storybook
    ([d3849b2](https://github.com/softconstruct/gene-ui-components/commit/d3849b20375b17d803e3bf6ee3163352bce84d81))
-   **Table:** add copied tooltip text for table col element
    ([#36](https://github.com/softconstruct/gene-ui-components/issues/36))
    ([356b35a](https://github.com/softconstruct/gene-ui-components/commit/356b35ae66b419bea53b4826a8df6197ecfa3074))
-   **Test:** add jest, enzyme and setup testing env
    ([c91f9d9](https://github.com/softconstruct/gene-ui-components/commit/c91f9d94949ea61ec246760e8588e339fe2b2188))
-   **Typescript:** add ts support, remove some redundant modules, change tree shake logic
    ([58838da](https://github.com/softconstruct/gene-ui-components/commit/58838da2b3c2ad8effaf64649d97cbb4444dfd44))

# 2.11.2 (2023-11-25)

### Bug Fixes

-   **ExtendedInput:** remove space in the beginning of
    placeholder([#20](https://github.com/softconstruct/gene-ui-components/issues/20))
-   **MapChart:** set animation prop to false ([#21](https://github.com/softconstruct/gene-ui-components/issues/21))
-   **NavigationMenu:** change a tag styles and header visibility
    logic([#28](https://github.com/softconstruct/gene-ui-components/issues/28))
-   **Profile:** add custom avatar option to Profile
    component([#26](https://github.com/softconstruct/gene-ui-components/issues/26))
-   **Table:** add row index value in useDrag hook callback
    function([#32](https://github.com/softconstruct/gene-ui-components/issues/32))
-   **table:** remove animation from the table component row
    actions([#23](https://github.com/softconstruct/gene-ui-components/issues/23))

# 2.11.0 (2023-11-15)

### Bug Fixes

-   **Uploader:** add uploader delete functionality
-   **Checkbox** add tooltip
-   **ActionBar:** remove ActionBar animation
-   **Checkbox:** change cursor type for hover and disabled states
-   **Checkbox:** checkbox tooltip
-   **CheckBoxGroupWithSearch:** add loading state
-   **DatePickerInput:** text and icon may overlap in some cases
-   **Dropdown:** change pointer in readOnly mode
-   **Dropdown:** select issue
-   **ExtendedInput:** add label width
-   **ExtendedInput:** availability in case of error
-   **ExtendedInput:** make available clear icon in case of error
-   **ExtendedInput:** number input changes its value when it is in a disabled state
-   **Option:** add tooltip to title and description
-   **Portal:** add optional chining to Portal unmount lifecycle
-   **Profile:** change languages, partners and bug fixes
-   **RangePicker:** add check on apply date to check is the input empty
-   **SearchWithDropdown:** dropdown width issue fix
-   **ValidatableNumberInput:** fix error handling in case of space for validatableInputField

### Features

-   **NavigationMenu:** add mobile version
-   **SuggestionList:** add placeholder value in the suggestion list

## 2.10.4 (2023-07-10)

### Bug Fixes

-   **Build:** add no verify flag for bump up commit and git tag
-   **Modal:** add loading state for the ok button
-   **Portal:** change portal append target from body to geneUIProviderRef.current
-   **Storybook:** set registry to local before view the package versions

## 2.10.3 (2023-07-04)

### Bug Fixes

-   **Tooltip:** change placement of tooltip popover

## 2.10.2 (2023-07-04)

### Bug Fixes

-   **Popover:** change popover parent container placement to provider

## 2.10.1 (2023-06-28)

### Bug Fixes

-   **Profile:** add checking before set partners and languages states

# 2.10.0 (2023-06-27)

### Bug Fixes

-   **AdvancedSearch:** add a new prop to show more loading state and changed the scroll position
-   **Button:** fix loading state for button component
-   **DatePickerInput:** icon and padding
-   **DatePickerInput:** reset icon direction and mobile version input value issue
-   **ExtendedInput:** change asterisk position
-   **Link:** add defaultProps for onClick and onMousDown
-   **Link:** change story
-   **Link:** fix onChange and onMouseDown
-   **MobilePopup:** remove spaces from left and right
-   **Radio:** changed the Radio components asterisk position
-   **Storybook:** add filter to solve only major release versions
-   **Storybook:** fix async render issue in the storybook decorators
-   **Storybook:** fix version selector list issue and stage link issue
-   **Storybook:** restyle sidebar
-   **v2.9.x:** update branch from v2.9.x
-   **ValidatableNumberInput:** fix validatable number input field error handling

### Features

-   **AdvancedSearch:** add advanced search component
-   **Bade:** add color primary and reset positioning options to the component
-   **Badge:** rewrite badge component
-   **Badge:** change mobile navigation
-   **Build:** improve build pipeline script
-   **Build:** improve build pipeline script
-   **Button:** add focus-visible and aria-label
-   **Image:** empty state visualization
-   **Link:** add button to the link component
-   **Link:** add focus-visible and aria-label
-   **Link:** add new Link component
-   **Link:** add role='button'
-   **Link:** changed onClick description
-   **Link:** code refactor
-   **Link:** prop name change
-   **Link:** removed target prop
-   **Option:** add title position prop for option component
-   **Option:** add title position prop for option component
-   **Overspread:** add onAnimationEnd prop
-   **Profile:** restyle for mobile and added new props containerParent and padding
-   **Provider:** add the provider component, css isolation build, content destination prop for popover
-   **Scrollbar:** add prop to change scroll top value dynamically
-   **Scrollbar:** add smooth scroll functional

# 2.9.0 (2023-04-07)

### Bug Fixes

-   **Combobox:** styles fixed
-   **DatePicker:** added new props "max" and "min" for DatePickerComponent.MonthPicker
-   **DatePickerInput:** fix onClick functionality
-   **Dropdown:** add new props
-   **ImagePreview:** imagePreview header alignment and width
-   **ImageUpload:** file type upper case error
-   **Menu:** added new onSubMenuClick prop

### Features

-   **Charts:** add loading and dateless states for charts
-   **DatePickerInput:** add reset functionality
-   **ImagePreview:** add default state to magnifier in image preview
-   **Tooltip:** show only child new prop

## 2.8.1 (2023-03-18)

### Bug Fixes

-   **Table:** change useDrag hook usage

# 2.8.0 (2023-03-13)

### Bug Fixes

-   **Table:** change dnd import in table component

### Features

-   **Storybook:** upgrade storybook version and improve docs

## 2.7.2 (2023-03-13)

### Bug Fixes

-   **Counter:** change absolute imports
-   **Counter:** show value of counter in tooltip

## 2.7.1 (2023-02-07)

### Bug Fixes

-   **MapChart:** change zoom in zoom out logic

# 2.7.0 (2023-02-03)

### Bug Fixes

-   **Counter:** fix lib components imports
-   **Textarea:** remove id from textarea tag
-   **Divider:** code fixes
-   **ExtendedInput:** textarea ref value
-   **HeatmapChart:** improving heatmap chart component margins
-   **Popover:** fixed prop types
-   **Profile:** fixed profile component toggle
-   **TimeInput:** change time input styles
-   **TimePicker:** changed TimePicker position and added new prop for positions
-   **Uploader:** added button type , and preview image ternary

### Features

-   **Counter:** add the counter component
-   **Divider:** added new prop withSpace for turn off default spacing
-   **Divider:** added new prop withSpace for turn off default spacing
-   **Popover:** added new props for scrollbar scrollbarProps
-   **TimeInput:** add input in date picker time

# 2.6.0 (2022-12-23)

### Bug Fixes

-   **Dropdown:** added tooltip for info icon, dark and RTL modes fixed
-   **HeatmapChart:** fix some cases in the HeatMapChart component

### Features

-   **ColumnRangeChart:** added new column range chart
-   **DatePicker:** calendar state improvement
-   **Uploader:** added Request Headers optionality

## 2.5.1 (2022-12-12)

### Bug Fixes

-   **Dropdown:** add state cleanup on destroy
-   **PackageJson:** fix small code style

# 2.5.0 (2022-12-12)

### Bug Fixes

-   **Dropdown:** add scope for top position scroll condition
-   **Dropdown:** code style fix
-   **GIT:** test husky pre commit hook
-   **GIT:** test husky pre commit hook lint staged
-   **PackageLock:** regenerate package-lock.json file
-   **PackageLock:** remove package-lock.json
-   **Src:** apply prettier and lint rules to src
-   **CI:** add pre commit hook and lint stage package

### Features

-   **Build:** change static files copy method after build
-   **Semver:** change semver rules
-   **Versioning:** remove dev branch from semver logic
-   **QRCode:** levels changed
-   **VulnerabilityPackages:** update vulnerable packages
-   **Changelog:** update changelog
-   **Style:** add local package for git-cz and custom config
-   **CodeStyle:** fix code style
-   **ESLint:** add rules to fix errors and warnings
-   **ESLint:** fix ESLint babel config issue
-   **Prettier:** format all existing code
-   **Prettier:** setup prettier config and ignore
-   **Stylelint:** add style lint rules and remove dist directory
-   **Stylelint:** add style linter for css and scss code lint

## 2.4.3 (2022-10-28)

### Bug Fixes

-   **DatePickerInput:** add icon and remove rangeSeparator prop
-   **DatePickerInput:** remove format prop from defaultProps

## 2.4.2 (2022-10-27)

### Bug Fixes

-   **Rollup:** add include external deps in plugins
-   **Dist:** remove dist folder from project and release config file
-   **DatePickerInput:** add new frozenDateRange prop
-   **DatePickerInput:** datePicker closing issue
-   **DatePickerInput:** fix DatePickerInput input onChange functionality
-   **Dropdown:** dropdown cant show data while isLoading state is true
-   **KeyValue:** scss width and flex improved
-   **KeyValue:** add direction ltr
-   **KeyValue:** fix component text style and add accessibility
-   **NavigationMenu:** add new condition for mounting labels
-   **Step:** add debounce for step detailed view component
-   **Step:** add detail view popover
-   **Step:** adding debounce for detail view popover to the step component
-   **Step:** debouncing step component
-   **TimePicker:** time picker component fires onBlur event

## 2.4.1 (2022-10-13)

### Bug Fixes

-   **DateRange:** fix date picker frozenDateRange and Dropdown selection.
-   **Dropdown:** fix dropdown selection issue.
-   **PackageLock:** fix package-lock json
-   **Hotfix:** hotfix without version change.
-   **Build:** remove dist folder from source code.
-   **Card:** add default prop to key value component in card col cmp
-   **Dropdown:** scroll in time of press arrowDown does not work correctly

# 2.4.0 (2022-10-11)

### Bug Fixes

-   **ArrowDown:** fix arrow down issue
-   **KeyDown:** fix key down issues
-   **Revert:** Revert "Merge branch 'Build/update-node-and-sass' into 'release/2.4.0'"
-   **Dropdown:** should opened after clicking arrow button and enter button on keyboard
-   **DatePickerInput:** add frozenDateRange for single date picker
-   **Holder:** fix holder hover render
-   **Holder:** fix onHover functionality
-   **NavigationMenuContent:** an element that has child elements is clickable
-   **StackedBarChart:** added variation of percentage
-   **StackedBarChart:** changed logic of background
-   **StackedBarChart:** handling negative data and added percentage par stacking
-   **StackedBarChart:** remove log
-   **Tabs:** Component icon not visible icon should be visible when withIcons prop is true
-   **DropDown refactoring:** remove unnecessary functional, fix bugs, code style improvement
-   **DropDown refactoring:** remove unnecessary functional, fix bugs, code style improvement
-   **DropDown:** remove unnecessary functional, fix bugs, code style improve
-   **KeyValue:** add default props
-   **StackedBarChart:** deleted redundant useState
-   **StackedBarChart:** improved and optimized
-   **StackedBarChart:** refactoring
-   **StackedBarChart:** fonts
-   **DropDown:** remove placeholder hide style

### Features

-   **ComboBox:** combobox is intended to add labels
-   **DatePickerInput:** disable selected range
-   **KeyValue:** add new appearance type for KeyValue component
-   **StackedBarChart:** add fake data
-   **StackedBarChart:** add new component StackedBarChart
-   **Step:** add step detail function for steps component
-   **Time:** startDate must accept string, moment, Date types
-   **Build:** change node-sass to sass
-   **Node:** changed node version and coupled sass

## 2.3.4 (2022-09-15)

### Bug Fixes

-   **Dropdown:** hide date when loading is true

## 2.3.3 (2022-09-09)

### Bug Fixes

-   **DonutChart:** add extra css to fix tooltip positions

## 2.3.2 (2022-09-06)

### Bug Fixes

-   **DonutChart:** add width style

## 2.3.1 (2022-09-06)

### Bug Fixes

-   **DonutChart:** remove dependency array from height calculation

# 2.3.0 (2022-09-06)

### Bug Fixes

-   **CheckboxGroup:** if state is empty select all option is hidden
-   **DonutChart:** DonutChart resize issue resolved
-   **DonutChart:** not enough responsive in empty state case
-   **Dropdown:** removing busy condition
-   **Export:** added unicode for csv file
-   **Tooltip:** added screenType alternative
-   **Uploader:** Removed file type requirement and added new prop → additionalContext
-   **Build:** delete dist folder from project repo
-   **CLI:** add create component CLI command

### Features

-   **ActionableList:** add new component

## 2.2.4 (2022-07-22)

### Bug Fixes

-   **DatePicker Footer:** added an object that is used to add a custom button to set a custom date
-   **DatePicker:** resolve conflicts
-   **RangeOptions:** start and end props can resolve any types (date, string, moment ....)

## 2.2.3 (2022-07-15)

### Bug Fixes

-   **Rollup:** add new loader to rollup config

## 2.2.2 (2022-07-15)

### Bug Fixes

-   **Collapse:** controlled case close issue
-   **DatePicker:** add mark date prop to date picker component
-   **MultiSelectDropdownField:** optional chaining to prev crashing

## 2.2.1 (2022-07-13)

### Bug Fixes

-   **DateRangePickerInput:** add new prop isIncludeEndDateLastSecond

# 2.2.0 (2022-07-11)

### Bug Fixes

-   **NavigationMenu:** use debounce function from utils
-   **PieChart:** remove unused imports
-   **DonutChart:** change props comment
-   **ComboTable:** draggable functional isn't working in case of one row
-   **DatePicker:** custom given format issue
-   **DonutChart:** fixed donut chart responsiveness
-   **Dropdown:** fix loader visibility issue in the dropdown list even if there is no data
-   **ExtendedInput:** add default value support
-   **Form:** add tooltip for formable fields
-   **MapChart:** replaced icon import in map chart
-   **NavigationMenu:** The menu sub tab closes immediately after moving the cursor
-   **PieChart:** pie chart fixed tooltip and custom tooltip formatter
-   **PieChart:** add customLegendFormatter and customTooltipFormatter props
-   **PieChart:** resolve comments
-   **PieChartStory:** wrapped into CodeBox component
-   **RangePicker:** error border color don't show, closes

### Features

-   **MobileNavigation:** add badge for MobileNavigation component
-   **RichEditor:** add toolbarButtons prop to support custom toolbar

## 2.1.1 (2022-06-23)

### Bug Fixes

-   **MapChart:** replaced icon import in map chart

# 2.1.0 (2022-06-22)

### Bug Fixes

-   **Semver:** add the semantic release package
-   **Semver:** change https fetch to ssh
-   **Commitlint:** overwrite commitlint.config
-   **Prettier:** add config to keep code style consistent
-   **CodeStyle:** code style fixing
-   **Collapse:** collapse issue related to controlled case
-   **Chart:** add region chart story
-   **Charts:** delete region chart default data
-   **Chart:** resolved comments

### Features

-   **Chart:** add region chart
-   **DateRangePickerInput:** add new prop isIncludeEndDateLastSecond
