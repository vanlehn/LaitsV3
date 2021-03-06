#Installation Instructions
Windows User: Windows user need to first install [cygwin](https://cygwin.com/install.html) and download make, wget packages in the set up. Then type "make install" in cygwin in LaitsV3 directory (previous directory) to install everything else.
Mac or linux user: Type "make install" in LaitsV3 directory (previous directory) in a command prompt that supports running of make files. 

#Information about the tests
For testing, we use:

* [mocha](http://visionmedia.github.io/mocha/) as our test runner
* [chai assertion library](http://chaijs.com/guide/styles/) for checking results with assert statements
* [selenium webdriverjs](https://github.com/webdriverio/webdriverio) for simulating browser commands
* [selenium server](http://docs.seleniumhq.org/download/) as the selenium server
* [phantomjs](http://phantomjs.org/) as the browser for efficiency and lack of user interface (not working yet; see below for running with chrome)

More information about how all five of these components work together can be found on [this link](http://code.tutsplus.com/tutorials/headless-functional-testing-with-selenium-and-phantomjs--net-30545).  We also use:

* [synchronize.js](http://alexeypetrushin.github.io/synchronize/docs/index.html) for handling asynchronous calls

Each browser handles certain aspects of dragoon differently. As a result, in order to test browser specific problems, we will need to write different test scripts for each specific browser. So at the time, the tests should be only run on phantomjs and chrome since they both work similarly. If you would like to see the run through, change the browser name to chrome on top of the test file, else, use phantomjs as the browser for the test files. I find it very helpful to be able to visualize the test happening when writing or editing tests. If you do decide to use chrome and you are a windows user, you need to install [chromedriver](http://code.google.com/p/selenium/wiki/ChromeDriver) and place the executable file in windows path. 

#Files
* dtestlib.js - library of functions which drive and/or retrieve information from the Dragoon UI
* example-test-paths.js - Copy this file to test-paths.js (same directory), and change the paths to match your local webserver set up.
* shakedown.js - Test script of unit tests for dtestlib; run this to ensure everything is working before running other test files.  (Also provides an example of how to write a test script.)
* coreTests/ - Holds tests which should be run to test all the core functionality of Dragoon itself.  (Listed below.)

The shakedown test imports selenium server and thus requires selenium server to be running.

#Dragoon Testing Library
In the original version of this work, test scripts called the webdriver directly.  Unfortunately that meant that when the Dragoon interface changed, it was very likely that all of the tests would need to be re-written.  This library abstracts away details such as element names and DOM structure so that tests won't break so long as the library itself is kept up to date.

Currently all of the exported library functions require at one argument: "client", the webdriver.io client.  Inside the library we use [synchronize.js](http://alexeypetrushin.github.io/synchronize/docs/index.html) to serialize the selenium calls, converting the asynchronous code into code that runs serially.

#Running tests
First, make sure you have created test-paths.js in tests/scripts (see example-test-scripts.js above).

To run through all the tests, a bash script has been provided called RunTests.sh.  This will run through every test script in the coreTests and bugTests folders.  It will also start and stop the selenium server automatically.

To run individual tests, you must first run the selenium server. To run the selenium server, redirect the command prompt to the tests directory and type:

    java -jar selenium-server-standalone-2.45.jar -log selenium.log &

Then, run mocha: 

    mocha <path-to-test(s)> -t 30000
    
The mocha command is the test runner the -t 30000, specifies in milliseconds the amount of seconds before mocha times out. Without specifying, mocha defaults to 2 seconds which may not be enough for server to respond.

When you're done, you can shut down your selenium server by calling:

    curl http://localhost:4444/selenium-server/driver/?cmd=shutDownSeleniumServer

You can also just point your web browser at that URL and it will shut the server down.

#Setup on OSX
There are additional steps to setting this up on OSX.  For starters, OSX to come with a -pre version of node.  One of the modules used by the synchronize module only works on stable versions of node.  You'll need to install a node version manager such as [n](https://github.com/tj/n).  To install n, run:

  npm install -g n

Once installed find the latest version of the even numbered release of node (e.g. 0.10.33) and install it. 

	n 0.10.33

Then run the makefile.

#Test Script List
* shakedown.js - Test script of unit tests for dtestlib; run this to ensure everything is working before running other test files.  (Also provides an example of how to write a test script.)

##Core Tests
* authorRabbits.js - Tests author mode by building a rabbits problem from scratch
* functionTest.js - Tests for the math functions
* graphTest.js - Tests the graph and table window
* studentCorrectRabbits.js - Solves the rabbits problem in student mode
* studentIncorrectRabbits.js - Solves the rabbits problem in student mode
