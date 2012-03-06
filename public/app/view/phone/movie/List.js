Ext.define('WL.view.phone.movie.List', {

	extend: 'WL.view.movie.List',

	config: {

		listeners: {
            order: 'before',
            select: function() {
                return false;
            },

            itemtap: function(dataview, index, target, record, evt) {

                var el = Ext.get(evt.target),
                	fireEvent;

                if (el.dom.nodeName == 'B') el = el.parent();

                WL.currentMovie = record;

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
                } else {
                	fireEvent = 'tapMovie';
                }

                if (fireEvent) {
	            	this.fireEvent(fireEvent, record, el);
                }
            }
        },

		disableSelection: true,

		itemTpl: Ext.create('Ext.XTemplate',
            '<div class="moreArrow"></div>',
		    '<div class="img"><img src="http://src.sencha.io/58/{smallImage}" /></div>',
		    '<div class="meta">',
		        '<h3>{title}</h3>',
		        '<div class="actions">',
		            '<div class="rating"><span>{% if (values.criticRating >= 0) { %}{criticRating}%{% } else { %}?{% } %}</span></div>',
		            '<button class="seen{[values.seen ? " selected" : ""]}">Seen It</button>',
		            '{% if (values.seen) { %}',
			            '<button class="thumb up{[values.like ? " selected" : ""]}"><b></b></button>',
			            '<button class="thumb down{[values.dislike ? " selected" : ""]}"><b></b></button>',
		            '{% } else { %}',
			            '<button class="want{[values.wantToSee ? " selected" : ""]}">Want to See It</button>',
			        '{% } %}',
		        '</div>',
		        '<div class="friends">{[this.friendActivity(values.friendActivity)]}</div>',
		    '</div>'
		)
    }
});
