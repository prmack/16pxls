# 16PXLS

Born out of a need for an icon set that would align well in vertical and horizontal lists. Great for navigation, buttons, headings or lists. If you are obsessed with things lining up, then this icon set is perfect for you!

![Alt text](/dist/docs/assets/images/readme.png?raw=true "Preview of Icons")

## Documentation

Reference for each icon can be accessed from `dist/docs/index.html`.

#### Css

Include `16pxls.css` in your `<head>` tags, or `@import url('');` in your Css.

`<link rel="stylesheet" href="assets/css/16pxls.css">` **or** `@import url('16pxls.css');`

Add the class `.icon-*` replacing the `*` with the name of the icon you want to use.

`<span class="icon-Skull"></span>`

This will add the icon as an SVG background image. You may want to create a separate class to style the container. e.g. `.icon {display:inline-block;width:16px;height:16px;}`

#### Font

Font has been built using [IcoMoon App](https://icomoon.io/), within the `dist/fonts/` folder you'll find the `demo.html` and `readme.txt` detailing how to use it.

## Gulp

During development I've used various Gulp plugins. If you want to take advantage of these you can.

`npm install` will install all packages needed.

#### Tasks

- `gulp cleanSVG` - Cleans SVG exported from Sketch
- `gulp processIcons` - Runs multiple tasks, in order, cleaning SVGs, converting them to image files (including Retina), and optimising. You could run this if you decided to only use a certain number of icons rather than uploading all of them. Also useful if you decided to create your own icon set!
- `gulp cleanIcons` - Used to remove all icons from folders.


## Included File Types

- .SVG
- .PNG
- .JPG
- .CSS
- .WOFF
- .TTF
- .EOT

## License

[Apache license 2.0](https://choosealicense.com/licenses/apache-2.0/)
