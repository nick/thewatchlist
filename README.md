# The Watch List

The Watch List lets you share which movies you have seen and want to see with your friends on Facebook.

It displays a list of the latest movies with its corresponding poster image, synopsis, trailer, critics rating
(from Rotten Tomatoes) and a list of friend activity: whether your friend wants to see it, have seen it and
if so whether they liked it or not.

It allows you to search for movies and order the listing by popularity, rating or release date.

The app is available with both Phone and Tablet views depending on your device type.

You can see a demo of the app in action at http://www.watchlistapp.com

## Facebook integration

The Facebook integration works by checking the user's authentication on the client side using the Facebook JS SDK. If
the user is not logged in, they are presented with a button which forwards them to Facebook to authenticate. Since some
actions must be performed on the server side, we need a valid access token on both the client AND server side.

Luckily, there is a way to create an access token on the server side by reading in a cookie set by Facebook during the
client-side authentication process. When the user returns to our app after logging in to Facebook and authorizing our
app, the cookie will be set and can be exchanged for an access token and stored in the session.  See the `checkSession`
method inside  server-side/facebook.js to see how this works in detail.

## Building

You will need a copy of Sencha Touch 2 from http://www.sencha.com/touch

The source code for Sencha Touch is not included in this repo, so you'll need to generate a 'test' application and copy
the sdk folder from the generated files into the `public` subdirectory of this project. See the Touch 2 Getting Started
Guide for info on how to do this.

Once you have the sdk folder in place, run these commands:

	cd public
	mv app.html index.html
	sencha app build production
	mv build/production/index.html build/production/app.html
	mv index.html app.html
	sed  -i "" "s/index\.html/app.html/" build/production/cache.manifest
	cd ..

This is neccessary due to the fact that the static file generator in Connect will serve index.html files automatically,
so we need to rename our index.html file to app.html. Unfortunately, the Sencha build command needs the main entry
point to the app to be named index.html. The solution is to rename app.html to index.html for the build process, then
rename it back to app.html.

## Config

You will need to create a file `config.js` with this content:

	exports.config = {
	    // Base URL of the App (must be a publically accessible URL)
	    redirect_uri:  'APP URL',

	    // Facebook Application ID
	    client_id:     'APPID',

	    // Facebook Application Secret
	    client_secret: 'SECRET',

	    // MongoDB endpoint
	    mongoDb:       'mongodb://USER:PASS@SERVER:PORT/DATABASE',

	    // Session encyption key
	    sessionSecret: 'RANDOM STRING',

	    appUrl: 'PUBLIC APP URL',
	    fbNamespace: 'FACEBOOK NAMESPACE',

	    rottenTomatoesApiKey: 'ROTTEN TOMATOES API KEY'
	}

## Deploying

Follow the instructions in the Jog With Friends example from the Sencha Touch 2 SDKs to learn how to set up your
Facebook application, Node.js, MongoDB and Heroku.

The commands you need to set up Git for use with Heroku are:

	git init
	git add .gitignore config.js Procfile app.js lib package.json views public/build/production
	git remote add heroku git@heroku.com:YOUR-HEROKU-APP.git
	git commit -m "Init"
	git push heroku master

More detailed instructions on building and deploying this app will appear soon.
