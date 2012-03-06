/**
 * This controller handles functions common to both Phone and Tablets
 */
Ext.define('WL.controller.Movies', {
    extend: 'Ext.app.Controller',

    config: {

        routes: {
            'movies/:id': 'onMovieUrl'
        },

        refs: {
            movieList: 'movieList',
            main: 'main',
            loggedOut: 'loggedOut',
            toolbar: 'movieDetail toolbar',
            sortBar: 'movieSortBar',
            searchBar: 'movieSearchBar',
            searchButton: 'main toolbar button[iconCls=search]'
        },

        control: {
            movieList: {
                tapMovie:    'onMovieTap',
                loadmorecmpadded: 'onLoadMoreCmpAdded'
            },
            movieDetail: {
                postToWall:  'onPostToWall',
                sendToFriend:'onSendToFriend',
                playTrailer: 'onPlayTrailer'
            },
            activity: {
                itemtap: 'onViewingTap'
            },
            searchButton: {
                tap: 'onSearchButton'
            },
            '#sortBy': {
                toggle: 'onSortToggle'
            },
            '#searchField': {
                action: 'onSearch',
                change: 'onSearch',
                clearicontap: 'onSearchClear'
            },
            'toolbar button[iconCls=movies]': {
                tap: 'onMovieIconTap'
            },
            'toolbar button[iconCls=friends]': {
                tap: 'onActivityIconTap'
            },
            '#fbProfilePic': {
                tap: 'onProfileTap'
            },
            '#logoutButton': {
                tap: 'logout'
            },
            '#movieShareButton': {
                tap: 'onMovieShare'
            }
        }
    },

    init: function() {
        WL.app.on({
            localStorageData: 'onLocalStorageData',
            scope: this
        });
    },

    onLocalStorageData: function(data) {
        var store = Ext.getStore('Movies');

        this.initContainer();
        store.setData(data.movies);
        store.fireEvent('load', store, store.data);

        this.onFirstLoad(data.profileId);
    },

    onFacebookLogin: function() {

        Ext.getBody().removeCls('splashBg');

        Ext.getStore('Movies').onBefore('datarefresh', function(store, data, operation, eOpts, e) {

            var cache = JSON.stringify({
                movies: operation.getResponse().movies,
                profileId: FB.getUserID()
            });

            if (window.localStorage && window.localStorage.WL && window.localStorage.WL == cache) {
                return false;
            }

            window.localStorage.WL = cache;

            if (!this.firstLoad) {
                this.onFirstLoad(FB.getUserID());
                this.firstLoad = true;
            }
        }, this);

        Ext.getStore('Movies').load();
    },

    onFirstLoad: function(profileId) {
        this.getSearchBar().setStyle('visibility: visible;');
        this.getSortBar().setStyle('visibility: visible;');
        this.getMovieList().setScrollToTopOnRefresh(false);

        Ext.getCmp('fbProfilePic').setData({
            profileId: profileId
        });
    },

    onLoadMoreCmpAdded: function() {
        var learnMore = this.getMovieList().add({
            xtype: 'container',
            cls: 'promo',
            html: '<span class="logo"></span>Brought to you by Sencha Touch 2 <button>Learn More</button>'
        });
        learnMore.element.on({
            tap: this.onAbout,
            scope: this,
            delegate: 'button'
        });
    },

    /**
     * When a user clicks the search button, scroll to the top
     */
    onSearchButton: function() {
        this.getMovieList().getScrollable().getScroller().scrollTo(0, 0, 'animation');
    },

    onMovieTap: function(record) {
        WL.app.updateUrl('movies/' + record.get('rottenId'));
        this.showMovie(record);
    },

    onViewingTap: function(list, idx, el, record) {
        this.onMovieUrl(record.get('movieId'));
    },

    onMovieUrl: function(movieId) {
        var movieStore = Ext.getStore('Movies'),
            movie = movieStore.findRecord('rottenId', movieId);

        if (movie) {
            this.showMovie(movie);
        } else {
            WL.model.Movie.load(movieId, {
                success: function(movie) {
                    this.showMovie(movie);
                },
                scope: this
            });
        }
    },

    onSearch: function(searchField) {

        var searchStore = Ext.getStore('Search'),
            value = searchField.getValue();

        if (value != '') {
            this.getMovieList().setMasked({ xtype: 'loadmask' });
            searchStore.load({
                params: { q: searchField.getValue() },
                callback: function() {
                    this.getMovieList().setStore(searchStore);
                    this.getMovieList().setMasked(false);
                },
                scope: this
            });
        }
    },

    onSearchClear: function() {
        this.getMovieList().setStore(Ext.getStore('Movies'));
    },

    onMovieIconTap: function() {
        this.getSearchButton().show();
        this.getMain().setActiveItem(this.getMovieList());
    },

    onActivityIconTap: function() {

        this.getSearchButton().hide();

        if (!this.activityCard) {
            this.activityCard = Ext.widget('activity');
            Ext.getStore('Activity').load();
        }
        this.getMain().setActiveItem(this.activityCard);
        this.activityCard.deselectAll();
    },

    onSortToggle: function(segBtn, btn){

        this.getMovieList().setStore(Ext.getStore('Movies'));
        this.getMovieList().setMasked({ xtype: 'loadmask' });
        this.getMovieList().deselectAll();

        Ext.getStore('Movies').getProxy().setExtraParams({sort: btn.getText()});
        Ext.getStore('Movies').loadPage(1);
    },

    /**
     * When the user profile picture is tapped, create a Logout button and pop it up next to the avatar.
     */
    onProfileTap: function(cmp) {

        if (!this.logoutCmp) {

            this.logoutCmp = Ext.create('Ext.Panel', {
                width: 120,
                height: 45,
                top: 0,
                left: 0,
                modal: true,
                hideOnMaskTap: true,
                items: [
                    {
                        xtype: 'button',
                        id: 'logoutButton',
                        text: 'Logout',
                        ui: 'decline'
                    }
                ]
            });
        }

        this.logoutCmp.showBy(cmp);
    },

    /**
     * Hide the logout popup, then call the Facebook logout function. We have a listener elsewhere to deal with the
     * `logout` event the Facebook SDK fires once the user has successfully been logged out.
     */
    logout: function() {
        this.logoutCmp.hide();
        FB.logout();
    },

    onFacebookLogout: function() {

        Ext.getBody().addCls('splashBg');
        Ext.Viewport.setActiveItem({ xtype: 'loggedOut' });

        if (this.movieDetailCmp) {
            this.movieDetailCmp.destroy();
        }

        this.getMain().destroy();
    },

    onMovieShare: function() {

        var me = this;

        Ext.create('WL.view.Dialog', {
            msg: "Share this movie to your Wall?",
            items: [
                {
                    xtype: 'textfield',
                    labelWidth: 0,
                    width: '100%',
                    cls: 'wallMessage',
                    id: 'wallMessage',
                    placeHolder: 'Message...'
                }
            ],
            buttons: [
                {
                    ui: 'green',
                    text: 'Post to wall.',
                    handler: function() {
                        me.postToWall();
                        this.getParent().hide();
                    }
                },
                {
                    ui: 'red',
                    text: "No thanks.",
                    handler: function() {
                        this.getParent().hide()
                    }
                }
            ]
        }).show();
    },

    onAbout: function() {
        Ext.create('WL.view.Dialog', {
            msg: [
                "<p>The Watch List was build with Sencha Touch, a Javascript framework that lets you easily build ",
                   "beautiful mobile apps using Javascript, HTML5 and CSS3.</p>",
            ].join(''),
            buttons: [
                {
                    ui: 'green',
                    text: 'Visit Sencha Touch Website',
                    handler: function() {
                        window.open("http://www.sencha.com/products/touch", "_blank");
                    }
                }
            ]
        }).show();
    },

    onPlayTrailer: function(movie) {
        var videoId = movie.get('trailer').match(/v=(.*)$/);
        WL.app.getController('YouTube').showTrailer(videoId[1]);
    },

    onFacebookUnauthorized: function() {
        if (this.mainContainer) {
            Ext.create('WL.view.Dialog', {
                msg: "Oops! Your Facebook session has expired.",
                buttons: [
                    {
                        ui: 'green',
                        text: 'Login to Facebook',
                        handler: function() {
                            window.location = WL.Facebook.redirectUrl();
                        }
                    }
                ]
            }).show();

        } else {
            Ext.Viewport.add({ xtype: 'loggedOut' });
        }
    }
});

