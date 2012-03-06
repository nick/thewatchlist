/**
 * The tablet container. Displays the movie list on the left and the movie detail pane on the right.
 */
Ext.define('WL.view.tablet.Container', {

	extend: 'Ext.Container',
	xtype: 'tabletContainer',

	config: {

		layout: 'card',

		items: [
		    {
		    	xtype: 'main',
		    	docked: 'left',
		    	width: 320,
		    	style: 'border-right: 2px solid #000'
		    },
		    {
		    	xtype: 'container',
		    	cls: 'tabletSplash',
		    	flex: 1
		    }
		]
	}
});
