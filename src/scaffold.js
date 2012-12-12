var prompt = require( "prompt" );

var commandFactory = function( _, anvil ) {

    anvil.command( {
        name: "anvil.scaffold",
        commander: {
            "gen [name], generate [name], new [name]": {
                action: "generate",
                description: "generate scaffold"
            },
            "scaffolds": {
                action: "list",
                description: "Lists installed scaffolds and their descriptions"
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
        list: function( options, done ) {
            console.log( "Installed scaffolds:" );
            var limit = 30,
                padding = new Array( limit ).join( " " );
            _.each( anvil.extensions.scaffolds, function( scaffold ) {
                var type = ( scaffold.type + padding ).substr( 0, limit ),
                    description = scaffold.description || "No description provided";
                console.log( "  " + type + description );
            } );
            done();
        }
    } );
};

module.exports = commandFactory;