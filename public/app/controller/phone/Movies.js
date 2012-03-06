/**
 * This is a Phone specific controller for Movies.
 */
Ext.define('WL.controller.phone.Movies', {
    extend: 'WL.controller.Movies',

    config: {
        routes: {
            'home': 'onMovieBack'
        },
        control: {
            '#movieBackButton': {
                tap: 'doMovieBack'
            }
        },
        refs: {
            toolbar: 'movieDetail titlebar'
        }
    },

    init: function() {

        this.callParent();

        WL.Facebook.on({
            connected: this.onFacebookLogin,
            logout: this.onFacebookLogout,
            unauthorized: this.onFacebookUnauthorized,
            scope: this
        });
    },

    onFacebookLogin: function() {
        this.callParent(arguments);
        this.initContainer();
    },

    initContainer: function() {
        if (!this.mainContainer) {
            this.mainContainer = Ext.Viewport.add({ xtype: 'main' });
        }
    },

    showMovie: function(record) {
        WL.currentMovie = record;

        if (!this.movieDetailCmp) {
            this.movieDetailCmp = Ext.widget('movieDetail');
        }

        this.getToolbar().setTitle(record.get('title'));

        Ext.Viewport.animateActiveItem(this.movieDetailCmp, {
            type: 'slide',
            direction: 'left'
        });

        // This needs to be after the item is painted so we can set the content height
        this.movieDetailCmp.setRecord(record);
    },

    doMovieBack: function() {
        WL.app.updateUrl('home');
        this.onMovieBack();
    },

    onMovieBack: function() {
        Ext.Viewport.animateActiveItem(this.getMain(), {
            type: 'slide',
            direction: 'right'
        });
    }

});
