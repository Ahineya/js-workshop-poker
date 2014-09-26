###Javascript workshop: poker
[![Build Status](https://travis-ci.org/Ahineya/js-workshop-poker.svg?branch=master)](https://travis-ci.org/Ahineya/js-workshop-poker)
#####Development

######Initial setup
To do initial project setup you need bower, grunt and grunt-cli installed globally:

```
npm install -g bower grunt grunt-cli
```

Then execute next command for dependencies installation:
```
npm install && bower install
```

######Running
To run development livereload environment, execute ```grunt develop```
To build project without running, use ```grunt build```
To run tests use ```grunt test``` command

To start project without tests and livereload use ```npm start``` command and open http://127.0.0.1:8080 in browser

Do not forget to reload manually when adding new files and folders!

######Structure

All project code is lying under /src folder.

In /src/client folder there are another folders:

* img for storing images
* js for javascript classes
* less for less files (they will be compiled into one style.css file)
* polymer-components for storing Polymer .html components

You can create .ejs files in /src/client directory, or create something like "/srv/client/views" folder - 
grunt is smart enough to work with them :)

After build grunt creates a /public folder and stores all built files in it.

* /public/vendor - folder that contains third-party libraries, e.g. Polymer
* /public/components - folder with copied /src/client/polymer-components folder

######Dom work
I have connected a simple pub/sub, ajax and DOM work library - http://github.com/mrlasking/domwork
We can use it for this tasks, or I can connect jQuery or smth else.

######Testing
There are /tests folder for tests. Feel free to create additional folders under /tests/client and /tests/server directories.
Any test file should be named as [name].tests.js

* Client tests runs under PhantomJS using Karma + Jasmine + Sinon
* Server tests runs using Mocha + Chai

Grunt creates /coverage directory after running tests with Istanbul reports.
