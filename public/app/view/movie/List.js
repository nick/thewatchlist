/**
 * This view contains functionality shared between the movie list component for Phone and Tablet profiles.
 */
Ext.define('WL.view.movie.List', {

	extend: 'Ext.List',
	requires: [
		'Ext.form.Panel',
		'Ext.plugin.ListPaging',
		'Ext.TitleBar',

		'WL.view.movie.SortBar',
		'WL.view.movie.SearchBar'
	],

	config: {

		store: 'Movies',
		plugins: 'listpaging',
		itemCls: 'expandedMovie',

		// Specifying the `items` config on an Ext.List will add them at the top of the list, before the list itself.
		items: [
		    { xtype: 'movieSortBar' },
		    { xtype: 'movieSearchBar' }
		],

		// We want to hide the search and sort bars initially, so we set an offset on the scroller
		scrollable: {
			initialOffset: {
				y: 100
			}
		},

		loadingText: null
	},

    /**
     * This is an XTemplate formatting function shared between the tablet and phone list views. It displays the profile
     * pictures of friends with activity on this movie. If there are more than 5 friends, it will say '+X friend'
     */
	friendActivityFormatter: function(activity) {

		var pics = [], friendIds = [], additionalFriends, numAdditionalFriends, i;

		if (activity && activity.length) {

			for (i=0; i < activity.length; i++) {
				if (!Ext.Array.contains(friendIds, activity[i].profileId)) {
    				pics.push('<img src="http://src.sencha.io/20/https://graph.facebook.com/' + activity[i].profileId + '/picture?type=square" />');
    				friendIds.push(activity[i].profileId);
				}
			}

			numAdditionalFriends = pics.length - 5;
			additionalFriends = numAdditionalFriends > 0 ? (' + ' + numAdditionalFriends + ' friend' + (numAdditionalFriends > 1 ? 's' : '')) : '';

			return pics.slice(0,5).join('') + additionalFriends;

		} else {
			return 'No Friend Activity'
		}
	},

	/**
	 * This function adds the formatting function above to the movie list template of the current profile. This is so
	 * we don't have to duplicate this function to each of the Movie Detail templates for both phone and tablet.
	 */
    applyItemTpl: function(){
    	var itemTpl = this.callParent(arguments);
    	itemTpl.friendActivity = this.friendActivityFormatter;
    	return itemTpl;
    }
});
