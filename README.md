# Gene UI components

> The design system to democratize a UI unification process of BI tools.

[![NPM registry](https://img.shields.io/npm/v/@geneui/components?style=for-the-badge&color=red)](https://www.npmjs.com/package/@geneui/components)
[![License](https://img.shields.io/badge/license-mit-green.svg?style=for-the-badge)](https://github.com/softconstruct/gene-ui-components/blob/main/LICENSE)

## Table of Contents

-   [Installation](#-installation)
-   [Usage](#-usage)
    -   [Importing Components](#importing-components)
    -   [Example](#example)
-   [Documentation](#-documentation)
    -   [API Reference](#api-reference)
-   [Contributing](#-contributing)
-   [Changelog](#-changelog)
-   [License](#%EF%B8%8F-license)

## ⚙️ Installation

You can install Gene UI components using npm or yarn:

```bash
# Yarn
yarn add @geneui/components

# NPM
npm install --save @geneui/components
```

## 👀 Usage

### Importing Components

To use a component in your project, first you need to import the provider in your main component e.g. in the App.js file

```js
import GeneUIProvider from '@geneui/components/GeneUIProvider';
```

Then you need to wrap your main component with provider

```js
<GeneUIProvider>
    <App />
</GeneUIProvider>
```

### Example

Now you can start use any components available in the package

```js
import { Button } from '@geneui/components';

function App() {
    return (
        <div>
            <Button>Do action</Button>
        </div>
    );
}
```

## 📝 Documentation

Explore in-depth documentation to make the most out of Gene UI components.

### API Reference

Visit our [API Reference](https://geneui.softconstruct.com/) for detailed information on each component, including props
and usage examples.

## 👍 Contributing

We welcome contributions from the community! Here's how you can get involved:

> 👉 See the [contributing docs](https://github.com/softconstruct/gene-ui-components/blob/main/CONTRIBUTING.md) for more
> info on code style, testing, coverage, and troubleshooting.

## 📜 Changelog

Stay up-to-date with the latest changes and improvements by checking our
[Changelog](https://github.com/softconstruct/gene-ui-components/blob/main/CHANGELOG.md).

## ⚖️ License

The Gene UI design system components is licensed under the
[MIT License](https://github.com/softconstruct/gene-ui-components/blob/main/LICENSE)
