
    window._gaq = window._gaq || [];
    window.optimizely = window.optimizely || [];

    var gup = function(name) {
            name = name.replace(/(\[|\])/g,"\\$1");
            var regex = new RegExp("[\\?&]"+name+"=([^&#]*)"),
                results = regex.exec( window.location.href );
                return ( results === null )?"":results[1];
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

    //hopefully your site is testing for box-sizing via Modernizr, but if not, let's assume it is if it isn't an IE below v8... but actually not needed, as IE7 seems to use border-box on selects by default!
    /*
    if (!window.Modernizr || (typeof Modernizr.boxsizing === "undefined" && (document.documentMode === undefined || document.documentMode > 7) ) ){
        $('html').addClass('boxsizing');
    }
    */
    if (nonsecure){
        console.log('WARNING: nonsecure domain = test mode.');
        $('body').prepend('<div class="insecure-warning">non-secure domain, using test mode.</div>');
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