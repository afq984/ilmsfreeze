# ilmsfreeze

## Development

### Prerequisites

* npm
* go 1.16 or later in `$PATH`
* (optional) python3 to create local extension

### (optional) Create local extension and load unpacked extension

<details>
<summary>[click to expand] Only required for developing download features</summary>

Convert the `chrome-extension` to support localhost development:

```
python3 tools/make_local_extensions.py
```

The command reads the `chrome-extension` directory and outputs a `localhost-chrome-extension` directory. The localhost extension matches and modifies requests from `localhost` instead of `ilmsfreeze.afq984.org`.

Load the unpacked extension:

* Go to `chrome://extensions`
* Enable *Developer mode*
* Click *Load unpacked*
* Select the `localhost-chrome-extension` directory

</details>

### Website development

Develop the js/ts part the `freeze-app/` directory.

Install stuff:

```
npm i
```

Run the test server:

```
npm run start
```

Format, lint, test:

```
npm run format
npm run lint
npm run test
```
