Ext.define('WL.view.Main', {

	extend: 'Ext.Container',

	requires: [
		'Ext.SegmentedButton',
		'WL.view.movie.List'
	],

	xtype: 'main',

	config: {

		layout: {
			type: 'card',
			animation: {
				type: 'fade'
			}
		},

		items: [
		    {
		        docked: 'top',
		        xtype: 'toolbar',
		        cls: 'small withBg',
		        title: '<div class="headerTitle"></div>',
		        items: [
		            {
		                xtype: 'segmentedbutton',
		                allowDepress: false,
		                items: [
		                    {
		                        cls: 'movies',
		                        iconCls: 'movies',
		                        pressed: true
		                    },
		                    {
		                        xtype: 'button',
		                        cls: 'friends',
		                        iconCls: 'friends'
		                    }
		                ]
		            },
		            {    xtype: 'spacer'    },
		            {
		                xtype: 'button',
		                cls: 'searchBtn',
		                iconCls: 'search'
		            },
		            {
		            	xtype: 'component',
		            	cls: 'fbProfilePic',
		            	id: 'fbProfilePic',
		            	tpl: '<img src="https://graph.facebook.com/{profileId}/picture?type=square" />'
		            }
		        ]
		    },
		    {
		    	xtype: 'movieList'
		    }
		]
	},

    initialize: function() {
        this.callParent();

        // Enable the Tap event on the profile picture in the toolbar, so we can show a logout button
        var profilePic = Ext.getCmp('fbProfilePic');
        if (profilePic) {
            profilePic.element.on('tap', function(e) {
                profilePic.fireEvent('tap', profilePic, e);
            });
        }
    }
})
