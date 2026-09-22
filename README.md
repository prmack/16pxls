Born out of a need for an icon set that would align well in vertical and horizontal lists. Great for navigation, buttons, headings or lists. If you are obsessed with things lining up, then this icon set is perfect for you!

![Alt text](/dist/docs/assets/images/readme.png?raw=true "Preview of Icons")

## v2

Version 2 drops the icon font and PNG/JPG output in favour of SVG only: an SVG sprite, individual SVG files, and a CSS file for background-image classes. v1 (icon font, PNG, JPG) is still published on npm as `16pxls@1` if you need it.

## Documentation

Icon names are listed in `dist/docs/assets/json/iconList.json`.

## Installation

`npm install 16pxls` or `yarn add 16pxls`

## Usage

### CSS background classes

`<link rel="stylesheet" href="node_modules/16pxls/dist/css/16pxls.css">` or `@import '16pxls/css';`

```html
<span class="icon icon-Skull"></span>
```

### SVG sprite

```html
<svg class="icon"><use href="node_modules/16pxls/dist/sprite.svg#icon-Skull"></use></svg>
```

### Individual SVGs

Import a single icon directly, e.g. with a bundler: `import skull from '16pxls/svg/Skull.svg'`.

## Building from source

`npm install`, then `npm run build`. Reads raw SVGs from `src/svg`, writes optimised SVGs, the sprite, the CSS and the icon list to `dist/`.

## Included File Types

- .SVG
- .CSS
- .FIG (for Figma)

## License

[CC-BY-SA-4.0](http://creativecommons.org/licenses/by-sa/4.0/)
