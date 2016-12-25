# gulp_helpers
Gulp file(s) for building a pipeline

Aimed at building static websites from dynamic content. This has several benefits:
1) Speed of loading - the webserver is just rendering plain HTML and doesn't have to go get the content from a DB
2) File number - a lot of hosts restrict the total number of files you can have eg. hostgator won't backup above 100K INodes. A wordpress    install can take several thousand files, especially with multiple themes.
3) Free hosts - more hosts support plain html over something like php or giving you a mysql database.
4) Security - you can't do sql injection when getting page content if there isn't a call to a database!

The pack comes with an install.bat that can install the dependencies you need.

There are several tasks - which I will be extending, combining etc

compress: uglify's javascript to es2015 preset and puts into dist/js folder.

backup: will make a zip folder backup with timestamp of current dist folder.

clean: deletes contents of dist folder

build-posts: Uses a jade templates with markdown .md to compile posts into html
             Stamps with google analytics (see ga-config var to put in your account info)
             
build-css: pipes css files to the dist/output folder

deploy: runs the sequence of tasks - takes a backup, cleans, builds images, builds css, builds posts.
        this step is protected with a password (set in in the gulpfile) to confirm that you want to deploy.
        I will be adding pushing out to an FTP server / uploading with this as well.
