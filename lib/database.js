
mongoose = require('mongoose');

Movie = mongoose.model('Movie', new mongoose.Schema({
    rottenId:     Number,
    title:        String,
    rank:         Number,
    smallImage:   String,
    largeImage:   String,
    mpaaRating:   String,
    runTime:      Number,
    releaseDate:  Date,
    userRating:   Number,
    synopsis:     String,
    cast:         String,
    imdbId:       String,
    criticRating: Number,
    criticsConsensus: String,

    genres:       String,
    studio:       String,
    director:     String,

    tagline:      String,
    budget:       Number,
    revenue:      Number,
    homepage:     String,
    trailer:      String,
    writer:       String
}));

Viewing = mongoose.model('Viewing', new mongoose.Schema({
    profileId: Number,  // Facebook profile ID
    name:      String,
    movieId:   Number,
    title:     String,
    seen:      Boolean,
    seenId:    Number,
    wantToSee: Boolean,
    wantToSeeId: Number,
    like:      Boolean,
    likeId:    Number,
    dislike:   Boolean,
    date:      Date
}));

mongoose.connect(config.mongoDb);
