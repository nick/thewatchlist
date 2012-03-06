Ext.define('WL.view.Activity', {
	extend: 'Ext.List',

	xtype: 'activity',

	config: {

		store: 'Activity',
		cls: 'fbActivity',

		emptyText: 'No friend activity yet',

		itemTpl: [
			'<img src="https://graph.facebook.com/{profileId}/picture?type=square" />',
			'<b>{name}</b> {action} <b>{title}</b>'
		]
	}
});
