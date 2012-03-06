
var _ = require('underscore');

exports.fetchOrCreateViewing = function(req, res, next) {

    Viewing.where('movieId', req.body.movieId).where('profileId', req.session.fb.user_id).findOne(function(err, viewing) {

        if (!viewing) {

            console.log("Saving New Viewing for " + req.session.fb.user_id + " (movie " + req.body.movieId + ")...");
            // Construct a new Viewing using the post data
            req.viewing = new Viewing({
                profileId: req.session.fb.user_id,
                name:      req.session.fb.user_data.first_name + ' ' + req.session.fb.user_data.last_name,
                date:      new Date,
                movieId:   req.body.movieId,
                title:     req.body.title
            });
        } else {
            console.log("Updating Viewing for " + req.session.fb.user_id + " (movie " + req.body.movieId + ")...");
            req.viewing = viewing;
        }

        next();
    });
}

// Parse the results from Rotten Tomatoes
exports.parseMovieResults = function(data, result) {

    result = result || {
        cache: {},
        idx: []
    };

    if (typeof data != 'object') {
        data = JSON.parse(data);
    }

    if (!data.movies || data.movies.length == 0) {
        data = { movies: [data] };
    }

    _.each(data.movies, function(movie) {

        if (movie.posters && movie.release_dates && movie.ratings) {
            var o = {
                rottenId: Number(movie.id),
                smallImage: movie.posters.profile,
                largeImage: movie.posters.detailed,
                title: movie.title,

                mpaaRating: movie.mpaa_rating,
                synopsis: movie.synopsis,
                runTime: Number(movie.runtime),
                releaseDate: movie.release_dates.theater,
                criticRating: Number(movie.ratings.critics_score),
                criticsConsensus: movie.critics_consensus,
                imdbId: (movie.alternate_ids ? movie.alternate_ids.imdb : null),
                cast: _.map(movie.abridged_cast, function(cast) { return cast.name }).join(', ')
            };

            result.cache[movie.id] = o;
            result.idx.push(movie.id);
        }

    });

    if (data.movies) {
        console.log("Parsed " + data.movies.length + " movies.")
    }

    return result;
}

exports.viewingAction = function(viewing) {

    var action;

    if (viewing.wantToSee) {
        action = 'wants to watch';
    }
    if (viewing.seen) {
        action = 'watched';
    }
    if (viewing.like) {
        action = 'liked';
    }
    if (viewing.dislike) {
        action = 'disliked';
    }
    if (viewing.recommendation) {
        if (viewing.recommendation == 1) {
            action = 'recommended';
        } else if (viewing.recommendation == 1) {
            action = 'did not recommended';
        }
    }

    return action;
}

exports.addViewingData = function(req, res, next, movieCache, movieIdx) {

    var data = { movies: [], total: movieIdx.length },
        start = Number(req.query.start) || 0,
        limit = Number(req.query.limit) || 10,
        len = Math.min(movieIdx.length, start + limit),
        movieIds = [],
        moviePointers = {},
        movieId, movie, idx, i, clone, action;

    for (i=start; i< len; i++) {
        movieId = movieIdx[i];
        movie = movieCache[movieId];

        moviePointers[movieId] = data.movies.length;

        clone = _.clone(movie);
        clone.friendActivity = [];

        data.movies.push(clone);
        movieIds.push(movieId);
    }

    Viewing.where('profileId').in(req.session.fb.friendIds).where('movieId').in(movieIds).sort('date', -1).run(function(err, viewings) {

        if (err) {
            handleError('Could not retrieve list of movies', viewings, req, res);
            return;
        }

        _.each(viewings, function(viewing) {

            idx = moviePointers[viewing.movieId];

            // If it's this user
            if (viewing.profileId == req.session.fb.user_id) {
                data.movies[idx] = _.extend(data.movies[idx], {
                    seen: Boolean(viewing.seen),
                    wantToSee: Boolean(viewing.wantToSee),
                    like: Boolean(viewing.like),
                    dislike: Boolean(viewing.dislike)
                });

                data.movies[idx].seen = Boolean(viewing.seen);
            } else {

                action = exports.viewingAction(viewing);

                if (action) {
                    data.movies[idx].friendActivity.push({
                        profileId: viewing.profileId,
                        name: viewing.name,
                        action: action,
                        date: viewing.date
                    });
                }
            }
        });

        res.json(data);
    });
}

exports.saveViewing = function(req, res, next) {

    console.log(req.viewing)

    // Save the viewing to the database
    req.viewing.save(function(err) {

        if (err) {
            handleError('Could not save viewing', err, req, res);
            return;
        }

        console.log("Successfully saved new viewing");

        var resp = { success: true };

        if (req.fbError) {
            resp.fbError = req.fbError;
        }

        res.json(resp);
    });
}
