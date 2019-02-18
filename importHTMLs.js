/*
MIT License

Copyright (c) 2019 omasakun (https://github.com/omasakun)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
**Make sure that this library is loaded earlier than any script.**

This library add an import-html tag.

For example, `<import-html src="./button.html"></import-html>` will be replaced with the contents of `./button.html`.  

By default, the import-html tag is replaced only when the page is read for the first time.  
(Exception: the import-html tag written in the file imported by the import-html tag will be replaced)  
If you want to interpret the import-html tag at other times, please call the importHTMLs function without arguments.

The load event handler added between the time that this library is loaded and the window load event fires is called after importHTMLs is executed.

The `<script src = "..." />` and `<script>  some JS code  </script>` written in the imported file is interpreted by the browser and the script to be loaded by that script tag will be loaded.

*/
(() => {
	var listeners = [];
	const tmp = window.addEventListener;
	window.addEventListener("load", (...args) => {
		importHTMLs().then(() => {
			listeners.forEach(_ => _[0](...args));
			listeners.forEach(_ => tmp("load", ...args));
			listeners = [];
		});
		window.addEventListener = tmp;
	});
	window.addEventListener = (type, ...args) => {
		if (type == "load") listeners.push(args);
		else tmp(type, ...args);
	}
})();
function importHTMLs() {
	const warn = (..._) => console.warn("[importHTMLs] ", ..._);
	return Promise.all(Array.from(document.getElementsByTagName("import-html")).map(importElem => {
		// This function returns whether the importHTMLs function needs to be re-called to read the newly added import-html tag.
		const path = importElem.getAttribute("src");
		if (!path) {
			warn("There was an import-html tag for which src does not specify the file path you want to load. Ignored it.");
			return false; // It is not necessary to re-call importHTMLs
		}
		return fetch(path)
			.then(res => res.text())
			.then(text => {
				let shouldReCall = false; // Whether it is needed to re-call importHTMLs
				let tmp = document.createElement("div");
				tmp.innerHTML = text;
				(function replaceScriptTag(elem) {
					elem.childNodes.forEach((child, index) => {
						if (child.tagName == "IMPORT-HTML") {
							shouldReCall = true;
						} else if (child.tagName == "SCRIPT") {
							let newElem = document.createElement("script");
							for (let i = 0; i < child.attributes.length; i++) {
								var attr = child.attributes.item(i);
								newElem.setAttribute(attr.nodeName, attr.nodeValue);
							}
							newElem.innerHTML = child.innerHTML;
							elem.replaceChild(newElem, child);
						} else {
							replaceScriptTag(child);
						}
					});
					return elem;
				})(tmp);
				tmp.childNodes.forEach(_ => importElem.parentElement.insertBefore(_, importElem));
				importElem.parentElement.removeChild(importElem);
				return shouldReCall;
			})
			.catch(err => warn("An error occurred while loading "+path + ". Detail...", err));
	})).then(shouldRecall => {
		if (shouldRecall.some(_ => _))
			return importHTMLs();
	});
}