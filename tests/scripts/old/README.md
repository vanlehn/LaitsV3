Installation Instructions:
Windows User: Windows user need to first install [cygwin](https://cygwin.com/install.html) and download make, python, wget packages in the set up. Then type "make install" in cygwin in LaitsV3 directory (previous directory) to install everything else.
Mac or linux user: Type "make install" in LaitsV3 directory (previous directory) in a command prompt that supports running of make files. 

Crucial information (delete when fixed):
Currently, the reordering of entries from selection in node editor is different for chrome and phantomjs (headless browser). This makes testing on phantomjs very difficult since I cannot see the ordering. Thus, the tests only work on chrome at the moment. 

Information about the tests:
For testing, we use [mocha](http://visionmedia.github.io/mocha/) as our test runner, [chai assertion library](http://chaijs.com/guide/styles/) for checking results with assert statements, [selenium webdriverjs](https://github.com/webdriverio/webdriverio) for simulating browser commands, [selenium server](http://docs.seleniumhq.org/download/) as the server and [phantomjs](http://phantomjs.org/) as the browser for efficiency and lack of user interface. More information about how all five of these components work together can be found on [this link](http://code.tutsplus.com/tutorials/headless-functional-testing-with-selenium-and-phantomjs--net-30545).

Each tests import selenium server and thus requires selenium server to be running. Each tests follows instruction sequentially to test the program one step at a time. As a result, if one step fails early in the program, the rest of the tests will likely to fail. So when errors show up on the command prompt, always look at the first error to figure out what problem occurred. Since these tests follow a very specific instruction step by step, any changes to the program will require changes to the tests. 

Each browser handles certain aspects of dragoon differently. As a result, in order to test browser specific problems, we will need to write different test modules for each specific browser. So at the time, the tests should be only run on phantomjs and chrome since they both work similarly. If you would like to see the run through, change the browser name to chrome on top of the test file, else, use phantomjs as the browser for the test files. I find it very helpful to be able to visualize the test happening when writing or editing tests. If you do decide to use chrome and you are a windows user, you need to install [chromedriver](http://code.google.com/p/selenium/wiki/ChromeDriver) and place the executable file in windows path. 

Currently, [Test1.js](tests/Test1.js) test the rabbit problem and all of the correct answers, [Test2.js](tests/Test2.js) test the rabbit problem with handling all possible incorrect responses and [testAuthor.js](tests/TestAuthor.js) test the author mode. [function.js](tests/function.js) has the functions to help the modules. For bugs on bugzilla, I have tested some bugs and wrote on others that are not intended to be tested. For future improvements, we need to write more tests on different problems as well as testing more bugs on bugzilla. To test a new problem, we will need to completely rewrite most of the code since each problem needs to be solved differently. 

In order for the webdriverjs to perform certain action such as clicking the element, you will need to find the specific identifier for the element such as by xpath. Different ways to find a certain element can be found on the webdriverjs website (link above).
	
Running tests:
To run through all the tests, type "make run" in any command prompt that support the running of the make file. To run an individual tests, you must first run the selenium server. To run the selenium server, redirect the command prompt to this directory and type "java -jar selenium-server-standalone-2.42.2.jar". Then, open git and type "mocha + the location and name of the file + -t 10000". So if I want to run Test1.js and I am in this directory, I would type "mocha tests/Test1.js -t 10000". The mocha command calls test runner mocha and the -t 10000, specifies in milliseconds the amount of seconds before mocha times out. Without specifying, mocha defaults to 2 seconds which may not be enough for server to respond. 