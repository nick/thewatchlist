Ext.define('WL.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Tablet',

        controllers: [
        	'Movies'
        ],

        views: [
        	'Container',
            'WL.view.tablet.movie.List',
        	'WL.view.tablet.movie.Detail'
        ]
    },

    launch: function() {
        WL.view.tablet.movie.List.addXtype('movieList');
        WL.view.tablet.movie.Detail.addXtype('movieDetail');
    },

    isActive: function() {
        return !Ext.os.is.Phone;
    }
});
