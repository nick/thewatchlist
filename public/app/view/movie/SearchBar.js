/**
 * The definition for the Search bar at the top of the movie list
 */
Ext.define('WL.view.movie.SearchBar', {

	extend: 'Ext.form.Panel',
	xtype: 'movieSearchBar',

	config: {

    	scrollable: false, // Override the form panel
    	style: 'visibility: hidden',
        cls: 'search',
        id: 'searchContainer',

        items: [
        	{
        		xtype: 'textfield',
        		clearIcon: true,
        		labelWidth: 0,
		        inputCls: 'searchField',
        		placeHolder: 'Enter Search Term',
        		id: 'searchField'
        	}
        ]
	}
});
