#!/usr/bin/env node

var chokidar = require( 'chokidar' ),
	cp = require( 'child_process' ),
	colors = require('colors'),
	glob = require('glob'),
	fs = require('fs'),
	yargs = require( 'yargs' )
		.usage( 'Watch the filesystem for changes and sync them with the remote JCR.\nUsage: $0' )
		.alias( 'H', 'help' )
		.describe( 'help', 'Print usage and quit.' )
		.alias( 'h', 'host' )
		.default( 'h', 'http://localhost:4502' )
		.describe( 'h', 'Remote host' )
		.alias( 'u', 'username' )
		.describe( 'u', 'Username' )
		.default( 'u', 'admin' )
		.alias( 'p', 'password' )
		.describe( 'p', 'Password' )
		.default( 'p', 'admin' )
		.alias( 'r', 'jcr_root' )
		.default( 'r', '.' )
		.describe( 'r', 'The path to your jcr_root folder' )
    .boolean( 'c' )
		.alias( 'c', 'clean')
		.describe( 'c', 'Clean up .vlt files on exit')
		.alias( 'f', 'filter' )
		.describe( 'f', 'The path to your META-INF/vault/filter.xml file.' )
		.default( 'f', '' ),
	argv = yargs.argv;

if ( argv.H ) {
	yargs.showHelp();
	process.exit( 0 );
}

if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

process.on("SIGINT", function () {
	  //graceful shutdown
  process.exit();
});

process.on( 'exit', function ( code ) {
	// Clean up all the .vlt files created by Vault.
	if (argv.clean) {
		files = glob.sync('**/.vlt', { cwd: argv.jcr_root });
		for (vltFile of files) {
			fs.unlinkSync(vltFile);
		}
		console.log("Cleaned up %d .vlt files".green, files.length);
	}
});

var VltWatch = {
	commands: {
		'checkout': 'vlt --credentials ' + argv.username + ':' + argv.password + ' checkout' + (argv.filter ? (' -f ' + argv.filter) : '') + ' --force ' + argv.host + '/crx ' + argv.jcr_root,
		'add': 'vlt add ',
		'rm': 'vlt rm ',
		'ci': 'vlt ci'
	},

	watcher: chokidar.watch( argv.jcr_root, {
		ignored: /(\.vlt|\.swp)/,
		persistent: true,
		ignoreInitial: true
	} ),

	exec: function ( cmd, options, callback ) {
		console.log( cmd.green );

		return cp.exec( cmd, options, function ( error, stdout, stderr ) {
			if ( stdout ) {
				console.log( stdout );
			}

			if ( stderr ) {
				console.error( stderr );
			}

			if ( error ) {
				console.error( error );
			}

			if ( options && typeof options === 'function' ) {
				options( error, stdout, stderr );
			}
			else {
				callback && callback( error, stdout, stderr );
			}
		} );
	},

	checkout: function ( callback ) {
		VltWatch.exec( VltWatch.commands.checkout, undefined, callback );
	},

	add: function ( path, callback ) {
		VltWatch.exec( VltWatch.commands.add + path, undefined, function ( callback ) {
			VltWatch.commit( callback );
		} );
	},

	remove: function ( path, callback ) {
		VltWatch.exec( VltWatch.commands.rm + path, undefined, function ( callback ) {
			VltWatch.commit( callback );
		} );
	},

	commit: function ( callback ) {
		VltWatch.exec( VltWatch.commands.ci, undefined, callback );
	}
}

module.exports = VltWatch;

console.log("Checking out vault...");
VltWatch.checkout( function () {
	console.log("Ready.".green);
	VltWatch.watcher
		.on( 'add', function ( path ) {
			VltWatch.add( path );
		} )
		.on( 'addDir', function ( path ) {
			VltWatch.add( path );
		} )
		.on( 'change', function ( path ) {
			VltWatch.commit();
		} )
		.on( 'unlink', function ( path ) {
			VltWatch.remove( path );
		} )
		.on( 'unlinkDir', function ( path ) {
			VltWatch.remove( path );
		} )
		.on( 'error', function ( error ) {
			console.error( 'Error happened', error );
		} );
} );
