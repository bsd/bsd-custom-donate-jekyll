
    window._gaq = window._gaq || [];
    window.optimizely = window.optimizely || [];

    var gup = function(name) {
            name = name.replace(/(\[|\])/g,"\\$1");
            var regex = new RegExp("[\\?&]"+name+"=([^&#]*)"),
                results = regex.exec( window.location.href );
                if( results === null ){ return "";} else {return results[1];}
        },
        report = function(ga,opt){
            window._gaq.push( ['_trackEvent'].concat(ga) );
            window.optimizely.push( ['trackEvent'].concat(opt) );
            //console.log("ANALYTICS:", ga,opt);
        },
        topics = {},
        hash = window.location.hash.replace("#",''),
        nonsecure = ( window.location.protocol.indexOf('s')===-1 ),
        nomin = ( gup('nomin')==="1" ),
        touch  = !!('ontouchstart' in window) || !!('msmaxtouchpoints' in window.navigator);



    if (nonsecure){
        console.log('WARNING: This form is on a nonsecure domain and can only work in test mode.');
        $('body').prepend('<div class="insecure-warning">This site is not running on a secure domain and is in test mode.</div>');
    }

    /*add pretty timeouts*/
    $.wait = function(time) {
      return $.Deferred(function(dfd) {
        setTimeout(dfd.resolve, time);
      });
    };

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