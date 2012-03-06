Ext.define('WL.view.tablet.movie.Detail', {

	extend: 'Ext.Container',

	config: {

        scrollable: 'vertical',

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                cls: 'small',
                items: [
                    {   xtype: 'spacer'   },
                    {
                        xtype: 'button',
                        cls: 'shareBtn',
                        iconCls: 'shareBtn',
                        id: 'movieShareButton'
                    }
                ]
            }
        ],
        tpl: Ext.create('Ext.XTemplate',
            '<div class="movieDetail tablet">',
                '<div class="movieDetailInner">',
                    '<div class="left">',
                        '<div class="img"><img src="{largeImage}" /></div>',
                        '<tpl if="trailer"><button class="trailer">Play Trailer</button></tpl>',
                    '</div>',
                    '<div class="actions">',
                        '<button class="seen{[values.seen ? " selected" : ""]}">Seen It</button>',
                        '{% if (values.seen) { %}',
                            '<button class="thumb up{[values.like ? " selected" : ""]}"><b></b></button>',
                            '<button class="thumb down{[values.dislike ? " selected" : ""]}"><b></b></button>',
                        '{% } else { %}',
                            '<button class="want{[values.wantToSee ? " selected" : ""]}">Want to See It</button>',
                        '{% } %}',
                        '<div class="rating"><span>{% if (values.criticRating >= 0) { %}{criticRating}%{% } else { %}?{% } %}</span> on Rotten Tomatoes</div>',
                    '</div>',
                    '<div class="synopsis">{synopsis}</div>',
                	'<tpl if="criticsConsensus"><div class="consensus">"{criticsConsensus}"</div></tpl>',
                    '<div class="extraInfo">',
                    	'<div>',
                    		'<p>{mpaaRating}, {formattedRunTime}</p>',
                    		'<p>{formattedReleaseDate}</p>',
                    		'<p>{studio}</p>',
                    		'<tpl if="genres"><p>Genre: {genres}</p></tpl>',
                    	'</div>',
                    	'<div>',
                            '<p>Cast: {cast}</p>',
                    		'<tpl if="director"><p>Directed By: {director}</p></tpl>',
                    	'</div>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="fbActivity">',
                '<tpl for="friendActivity">',
                    '<div class="x-list-item"><div class="x-list-item-label">',
                        '<img src="https://graph.facebook.com/{profileId}/picture?type=square" />',
                        '<b>{name}</b> {action} it',
                    '</div></div>',
                '</tpl>',
            '</div>',
            {
                selected: function() {
                    return Math.round(Math.random(1)) ? ' selected' : '';
                },
                castList: function(cast) {
                	return Ext.Array.map(cast, function(c) {
                		return c.name;
                	}).join(', ');
                }
            }
        )
    },

    initialize: function() {

		this.element.on({
			tap: function(e, dom) {

                var el = Ext.get(e.target),
                    fireEvent;

                if (el.dom.nodeName == 'B') el = el.parent();

                if (e.target.nodeName.match(/button|b/i)) {
                    if (el.hasCls('seen')) {
                        fireEvent = el.hasCls('selected') ? 'unSeen' : 'seen';
                        el.toggleCls('selected');
                    } else if (el.hasCls('want')) {
                        fireEvent = el.hasCls('selected') ? 'unWantToSee' : 'wantToSee';
                        el.toggleCls('selected');
                    } else if (el.hasCls('thumb') && el.hasCls('up')) {
                        fireEvent = el.hasCls('selected') ? 'unLike' : 'like';
                        el.toggleCls('selected');
                    } else if (el.hasCls('thumb') && el.hasCls('down')) {
                        fireEvent = el.hasCls('selected') ? 'unDislike' : 'dislike';
                        el.toggleCls('selected');
                    } else if (el.hasCls('postToWall')) {
                        fireEvent = 'postToWall';
                    } else if (el.hasCls('sendToFriend')) {
                        fireEvent = 'sendToFriend';
                    } else if (el.hasCls('trailer')) {
                        fireEvent = 'playTrailer';
                    }

                    if (fireEvent) {
                        this.fireEvent(fireEvent, WL.currentMovie, el);
                    }
                }
			},
			scope: this
		});
    }
});
