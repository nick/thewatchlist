
Ext.define('WL.store.Search', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'WL.model.Movie',

        pageSize: 10,

        proxy: {
            type: 'jsonp',
            url: '/search',

            reader: {
                type: 'json',
                rootProperty: 'movies'
            }
        }
    }
});
