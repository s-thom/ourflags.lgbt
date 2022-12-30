# Developer setup

This project is built on Next.js, which itself uses Node.js. The exact version of Node being used is in the `.node-version` file.

Once you've installed Node and cloned the repository, run `npm ci` to install the required dependencies. You will also need to run `npm run generate-data` in order to create the files generated from the Markdown in the `content/` directory.

Finally, run `npm run dev` to start the development server. It should start at `localhost:3000`

## Tooling

This project uses [EditorConfig](https://editorconfig.org/), [ESLint](https://eslint.org/), and [Prettier](https://prettier.io/).

For VS Code, the following plugins are recommended:

- `EditorConfig.EditorConfig`
- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`

If you use another editor, check to see if you have integrations for these tools.

## Have a look around

Check out [the issues page](https://github.com/s-thom/ourflags.lgbt/issues) to see if there's anything interesting for you to work on. Issues will be categorised by labels, such as "good first issue" if you're unsure where to start.

Some notable locations in the codebase:

- `app/`
  Code related to the pages of the website. This project uses Next.js 12's app directory
- `content/`
  Markdown files that are used to generate flags and categories.
- `lib/`
  - `lib/components/`
    Most React components are defined here.
  - `lib/data/`
    Location of files generated from `content/`.
  - `lib/server/`
    Code that should only be run on the server.
- `pages/api/`
  Functions for generating favicons and OpenGraph social images on-the-fly. Due to the number of combinations of flags, it's impractical to generate all of them at build time.
- `scripts/`
  Currently home to the script that generates the `lib/data/` directory from `content/`.
