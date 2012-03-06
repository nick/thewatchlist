Ext.define('WL.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',

        controllers: [
        	'Movies'
        ],

        views: [
        	'WL.view.phone.movie.List',
        	'WL.view.phone.movie.Detail'
        ]
    },

    launch: function() {
        WL.view.phone.movie.List.addXtype('movieList');
        WL.view.phone.movie.Detail.addXtype('movieDetail');
    },

    isActive: function() {
        return Ext.os.is.Phone;
    }
});
