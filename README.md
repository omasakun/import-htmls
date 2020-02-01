# importHTMLs
## Demo
[Open This](https://omasakun.github.io/import-htmls/demo/)

## Usage
1. Copy `importHTMLs.js` to your project.
2. Write `<script src="importHTMLs.js">` in the `<head>` tag before loading any other scripts using `window.addEventListener("load", ... )`.
3. If you've found any issue, feel free to ask me to fix the issues (or, create a pull request).

## Description
**Make sure that this library is loaded earlier than any script.**

This library add an import-html tag.

For example, `<import-html src="./button.html"></import-html>` will be replaced with the contents of `./button.html`.  

By default, the import-html tag is replaced only when the page is read for the first time.  
(Exception: the import-html tag written in the file imported by the import-html tag will be replaced)  
If you want to interpret the import-html tag at other times, please call the importHTMLs function without arguments.

The load event handler added between the time that this library is loaded and the window load event fires is called after importHTMLs is executed.

The `<script src = "..." />` and `<script> /* some JS code */ </script>` written in the imported file is interpreted by the browser and the script to be loaded by that script tag will be loaded.
