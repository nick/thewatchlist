/**
 * The definition for the Sort bar at the top of the movie list
 */
Ext.define('WL.view.movie.SortBar', {

	extend: 'Ext.Toolbar',
	xtype: 'movieSortBar',

	config: {

		cls: 'sort',
		id: 'sortContainer',
		style: 'visibility: hidden',

		items: [
			{
				xtype: 'segmentedbutton',
				id: 'sortBy',
				flex: 1,

				layout: {
					pack: 'center'
				},

				defaults: {
		    		xtype: 'button',
		    		flex: 1
				},

				items: [
		    		{ text: 'Popular', pressed: true },
		    		{ text: 'Rating' },
		    		{ text: 'Release Date' }
				]
			}
		]
	}
});
