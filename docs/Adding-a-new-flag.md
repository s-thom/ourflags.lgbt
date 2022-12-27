# Adding a new flag

Flags are defined in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) files in the `content/flags` directory. This allows for rich text formatting, though this isn't necessary most of the time.

## Format

Each flag's Markdown file is made of three sections, as follows.

```md
---
metadata:
  see: below for more details
---

A short summary shown on the shared page, along with a link to a page that contains the full content below.

---

Full content. Shown on each flags' detail page.
```

## Metadata

The metadata is specified in [YAML](https://yaml.org/).

| Name                   | Description                                                                      | Required |
| ---------------------- | -------------------------------------------------------------------------------- | -------- |
| `id`                   | Unique ID for this flag. Should match the file name.                             | ✅       |
| `name`                 | Name of the flag.                                                                | ✅       |
| `shortName`            | A shorter name to show in space-constrained areas.                               |          |
| `order`                | Override for sorting. Equal values are sorted alphabetically by name.            |          |
| `shortcodes`           | List of shortcodes that refer to this flag. Must be unique to this flag.         | ✅       |
| `categories`           | List of categories this flag can appear in.                                      | ✅       |
| `flag`                 | Data for building the flag image.                                                | ✅       |
| `flag.stripes`         | List of colours for each horizontal stripe in the flag.                          | ✅       |
| `flag.additionalPaths` | String of SVG elements that go on top of the stripes.                            |          |
| `background`           | Background colours for the gradient used in sections for this flag.              | ✅       |
| `background.light`     | Gradient colours to use in light themes.                                         | ✅       |
| `background.dark`      | Gradient colours to use in dark themes. Uses the light theme colours if omitted. |          |

Annotated example:

```yaml
# Unique ID. This is used in the URL for the flag's details page.
id: pride-gilbert-baker
# The full name of the flag that is shown on the website.
name: Gilbert Baker Pride Flag
# Override the order this flag appears in lists.
# In this case, this flag will appear very highly (probably first).
order: 1
# Shortcodes are used in the share links.
# The link `/FooBarPgbBaz` would include this flag.
shortcodes: ["Pgb"]
# Categories the flag appears in.
categories: ["everyone"]
flag:
  # Colours for each of the stripes in the flag.
  stripes:
    [
      "#ff69b4",
      "#ff0000",
      "#ff8e00",
      "#ffff00",
      "#008e00",
      "#00c0c0",
      "#400098",
      "#8e008e",
    ]
  # This particular flag doesn't have any extra designs on it, so it doesn't have `additionalPaths`.
background:
  # Gradient colours are in OKLCH for easy editing/inspecting.
  # Note that within each array, both colours have the same lightness and chroma.
  light: ["oklch(80% 0.045 352)", "oklch(80% 0.045 288)"]
  dark: ["oklch(40% 0.065 352)", "oklch(40% 0.065 288)"]
```

### Colours

Colours can be specified in a few formats. When creating the background gradients, I recommend using [OKLCH](https://bottosson.github.io/posts/oklab/) as it helps keep a consistent lightness and level of contrast against text, which is important for those with vision impairments.

A recommended workflow for the background gradients is to copy/paste the OKLCH values from another flag to keep the same Lightness and Chroma values, and then use the [OKLCH colour picker](oklch.evilmartians.io/) to find the correct hue value for your colour.

## Writing style

I don't have a formal styleguide for prose in this project. I'm aiming for something less dry than Wikipedia, but still on the informative side.

- [Oxford commas](https://en.wikipedia.org/wiki/Serial_comma) are cool, awesome, and useful.
- Full stops go at the end of sentences and sentence fragments, even in list items where they can often be implied.
- Where possible, provide sources in the details page.
