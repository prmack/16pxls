Born out of a need for an icon set that would align well in vertical and horizontal lists. Great for navigation, buttons, headings or lists. If you are obsessed with things lining up, then this icon set is perfect for you!

![Alt text](/dist/docs/assets/images/readme.png?raw=true "Preview of Icons")

## Documentation

Reference for each icon can be accessed from `dist/docs/index.html`.
If you've not use SVG before then I suggest you check out the [Further Reading](#further-reading) section, for a list of articles to get up to speed.

#### Installation

`npm install 16pxls` or `yarn add 16pxls`

If you are not using a package manager then feel free to just download the zip off Github.

#### Css

Include `16pxls.css` in your `<head>` tags, or `@import url('');` in your Css.

`<link rel="stylesheet" href="/dist/css/16pxls.css">` **or** `@import url('16pxls.css');`

Add the class `.icon-*` replacing the `*` with the name of the icon you want to use.

`<span class="icon-Skull"></span>`

This will add the icon as an SVG background image. You may want to create a separate class to style the container. e.g. `.icon {display:inline-block;width:16px;height:16px;}`

#### Font

Font has been built using [IcoMoon App](https://icomoon.io/), within the `dist/fonts/` folder you'll find the `demo.html` and `readme.txt` detailing how to use it.

## Gulp

During development I've used various [Gulp](http://gulpjs.com) plugins. If you want to take advantage of these you can.

`npm install` **or** `yarn install` depending on your preferred package manager.

#### Tasks

- `gulp cleanSVG` - Cleans SVG exported from Sketch
- `gulp cleanIcons` - Used to remove all icons from folders (not .SVGs), useful if you only want to use a few SVGs.
- `gulp iconList` - Creates a .JSON file of all icons in `/dist/svg/` folder, useful for fallbacks. Outputs to `dist/docs/assets/json`.
- `gulp processIcons` - Runs multiple tasks, in order, cleaning SVGs, converting them to image files (including Retina), and optimising. You could run this if you decided to only use a certain number of icons rather than uploading all of them.

#### Recommended Plugins

- [gulp-embed-svg](https://www.npmjs.com/package/gulp-embed-svg). Great for embedding SVG data whilst keeping code clean during development.

## Further Reading

- [Using SVG - CSS Tricks](https://css-tricks.com/using-svg/)
- [SVG & CSS - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS)
- [A Complete Guide to SVG Fallbacks - CSS Tricks](https://css-tricks.com/a-complete-guide-to-svg-fallbacks/)

## Included File Types

- .SVG
- .PNG (inc. Retina)
- .JPG (inc. Retina)
- .CSS
- .WOFF
- .TTF
- .EOT
- .FIG (for Figma)

## License

[CC-BY-SA-4.0](http://creativecommons.org/licenses/by-sa/4.0/)
