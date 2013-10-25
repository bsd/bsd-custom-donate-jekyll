
    var gup = function(name) {
            name = name.replace(/(\[|\])/g,"\\$1");
            var regex = new RegExp("[\\?&]"+name+"=([^&#]*)"),
                results = regex.exec( window.location.href );
                if( results === null ){ return "";} else {return results[1];}
        },
        topics = {},
        hash = window.location.hash.replace("#",''),
        nonsecure = ( window.location.protocol.indexOf('s')===-1 ),
        nomin = ( gup('nomin')==="1" );

    if (nonsecure){
        console.log('WARNING: This form is on a nonsecure domain and can only work in test mode.');
        $('body').prepend('<div class="insecure-warning">This site is not running on a secure domain and is in test mode.</div>');
    }

    /*add basic pub sub, for error-free behavior chains*/
    $.Topic = function( id ) {
        
        var callbacks,
            topic = id && topics[ id ];
        if ( !topic ) {
            callbacks = $.Callbacks();
            topic = {
                publish: callbacks.fire,
                subscribe: callbacks.add,
                unsubscribe: callbacks.remove
            };
            if ( id ) {
                topics[ id ] = topic;
            }
        }
        return topic;
    };