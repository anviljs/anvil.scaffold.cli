var prompt = require( "prompt" );

var commandFactory = function( _, anvil ) {

    anvil.command( {
        name: "anvil.scaffold",
        commander: {
            "gen [name], generate [name], scaffold [name]": {
                action: "generate",
                description: "generate scaffold"
            },
            "scaffold": {
                action: "util",
                description: "gather information about scaffolds",
                options: [
                    [ "-l, --list", "get a list of the installed scaffolds and see their descriptions" ]
                ]
            }
        },
        generate: function( scaffoldName, options, done ) {
            var scaffold = anvil.extensions.scaffolds[ scaffoldName ];
            if( scaffold ) {
                if( scaffold.prompt ) {
                    prompt.message = "";
                    prompt.delimiter = "";
                    prompt.start();
                    prompt.addProperties( scaffold._viewContext, scaffold.prompt, function( err ) {
                        if( err ) {
                            anvil.log.error( "\nError collecting user input for scaffold '" + scaffold.type + "' :\n\t " + err );
                            done();
                        }
                        scaffold._processData();
                        scaffold.build( done );
                    } );
                } else {
                    scaffold.build( done );
                }
            } else {
                done();
            }
        },
        util: function( options, done ) {
            if( options.list ) {
               console.log( "Installed scaffolds:" );
                var limit = 30,
                    padding = new Array( limit ).join( " " );
                _.each( anvil.extensions.scaffolds, function( scaffold ) {
                    var type = ( scaffold.type + padding ).substr( 0, limit ),
                        description = scaffold.description || "No description provided";
                    console.log( "  " + type + description );
                } );
            } else {
                done();
            }
        }
    } );
};

module.exports = commandFactory;