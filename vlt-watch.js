#!/usr/bin/env node

var chokidar = require( 'chokidar' ),
	cp = require( 'child_process' ),
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
		.alias( 'f', 'filter' )
		.describe( 'f', 'The path to your META-INF/vault/filter.xml file.' )
		.default( 'f', '' ),
	argv = yargs.argv;

if ( argv.H ) {
	yargs.showHelp();
	process.exit( 0 );
}

process.on( 'exit', function ( code ) {
	// todo: clean up all of the .vlt files that vault creates.
} );

var VltWatch = {
	commands: {
		'checkout': 'vlt --credentials ' + argv.username + ':' + argv.password + ' checkout' + (argv.filter ? (' -f ' + argv.filter) : '') + ' --force ' + argv.host + '/crx',
		'add': 'vlt add ',
		'rm': 'vlt rm ',
		'ci': 'vlt ci'
	},

	watcher: chokidar.watch( '.', {
		ignored: /(\.vlt|\.swp)/,
		persistent: true,
		ignoreInitial: true
	} ),

	exec: function ( cmd, options, callback ) {
		console.log( cmd );

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

VltWatch.checkout( function () {
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