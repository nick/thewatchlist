/**
 * This controller handles the viewing of Trailers. At initialization, it ensures the YouTube HTML5 player API is
 * loaded
 */
Ext.define('WL.controller.YouTube', {
    extend: 'Ext.app.Controller',

    config: {
    },

    init: function() {
    	var tag = document.createElement('script');
	    tag.src = "http://www.youtube.com/player_api";
	    var firstScriptTag = document.getElementsByTagName('script')[0];
	    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	    onYouTubePlayerAPIReady = this.onYouTubeReady;
    },

    onYouTubeReady: function() {
    },

    showTrailer: function(videoId) {

        if (!this.trailerCmp) {

            this.trailerCmp = Ext.create('Ext.Container', {
                top: 47,
                left: 0,
                hideOnMaskTap: true,
                bottom: 0,
                modal: true,
                right: 0,
                html: '<div id="trailerPlayer"></div>'
            });

            Ext.Viewport.add(this.trailerCmp);

            this.trailerCmp.on('hide', function() {
                this.player.stopVideo();
            }, this);

	    	this.player = new YT.Player('trailerPlayer', {
				videoId: videoId,
				width: this.trailerCmp.element.getWidth(),
				height: this.trailerCmp.element.getHeight(),
                playerVars: {
                    enablejsapi: 1
                },
				events: {
					'onReady': Ext.bind(this.onPlayerReady, this),
					'onStateChange': Ext.bind(this.onPlayerStateChange, this)
				}
			});

        } else {
            this.player.cueVideoById(videoId);
            this.trailerCmp.show();
        }

    },

    onPlayerReady: function() {
    	// console.log("Player ready")
    },

    onStateChange: function() {
    	// console.log("Player state change")
    }
});
