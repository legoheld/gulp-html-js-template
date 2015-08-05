var gutil = require('gulp-util');
var through = require('through2');
var _ = require('lodash');
var cheerio = require("cheerio");
var template = _.template;

//consts
const PLUGIN_NAME = 'gulp-html-js-template';


module.exports = function( options ) {
	
	if( options == undefined ) {
		options = {};
	}
	
	if( options.ext == undefined ) {
		options.ext = 'js';
	}
	
	return through.obj( function( file, enc, cb ) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if( file.isStream() ) {
			cb(new gutil.PluginError( PLUGIN_NAME, 'Streaming not supported'));
			return;
		}
		
		if( file.isBuffer() ) {
			
			var html = cheerio.load( file.contents.toString() );
			var templates = parseTemplates( html );
			var fileContent = parseFileContent( html );
			var compiled = template( fileContent );
			var content = compiled( { templates:JSON.stringify( templates ) } );
			file.contents = new Buffer( content );
		}

		// adjust file extension
		file.path = file.path.replace(/\.\w+$/gi, '.' + options.ext );
		this.push( file );
		
		return cb();
	});
};


function parseTemplates( html ) {
	
	var data = {};

	html( '#templates' ).children().each( function( i, element ) {
		
		var node = cheerio( this );
		var text = node.html();
		
		// remove formatting
		text = text.replace( /\n|\r|\t/g, '' );
		
		// decode html entities
		text = text.replace( /&apos;/g, "'" ).replace( /&amp;/g, "&" ).replace( /&gt;/g, ">" ).replace( /&lt;/g, "<" ).replace( /&quot;/g, '"' );
		
		data[ node.attr( 'id' ) ] = text;
	});
	
	return data;
}

function parseFileContent( html ) {
	
	var node = html( '#file-content' );
	if( node.is( '#file-content' ) ) {
		return node.html();
	} else {
		return 'var templates = <%= templates %>';
	}
}