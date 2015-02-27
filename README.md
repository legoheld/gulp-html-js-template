HTML templates to JS
====================

This gulp plugin converts a html file with templates into a js file containing an object with all templates as strings.

Writing template inside a structured HTML file is much more practical than in a one line javascript string.
Therefore this plugin turns a HTML file with templates into a js object.
You can use whatever template language you like it simply turns the html nodes into a js string.
It will take the html id attribute as the key and its innerHTML as the value.

Usage
-----
An example usage with gulp:
```javascript
var gulp        = require('gulp');
var html2js = require('gulp-html-js-template');

gulp.task('template', function() {
	return gulp.src( 'my/template.html' )
	.pipe( html2js() )
	.pipe( gulp.dest( 'output' ) );
});
```

Example
-------

This example shows how this plugin turn html into a js object.

*HTML Source* :
```html
<div id="templates">

	<div id="my-example-template">
		<p>A {{ handlebar }} example.</p>
	</div>
	
</div>
```

*The generated output* :
```javascript
var templates = {"my-example-template":"<p>A {{ handlebar }} example.</p>"}
```

Custom JS Code
--------------

If you like to adjust the content of the generated js file you can define that inside the html file.

*HTML Source including custom js* :
```html
<script id="file-content" type="text/javascript">
// Here I can program whatever I want.
var myProject = {};
myProject.templates = <%= templates %>;
</script>

<div id="templates">

	<div id="my-example-template">
		<p>A {{ handlebar }} example.</p>
	</div>
	
</div>
```

*The generated output* :
```javascript
// Here I can program whatever I want.
var myProject = {};
myProject.templates = {"my-example-template":"<p>A {{ handlebar }} example.</p>"};
```

Options
-------

`{ ext:'js' }` The extension of the generated output file. If you like to generate something different that a js file. For example for Coffescript or Typescript.