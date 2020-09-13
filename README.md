# ezAuth

ez-auth is a Command line tool to create a flexible boiler plate for node-express server, mongoDB (mongoose ORM) and passport JS authentication default on demand setup for popular providers. 
It sets up:
    1. a passport js boiler plate for Authentication 
    2. node-express basic server
    3. Selective authentication protection for certain database Collections
    4. npm package (if user chooses to initialise npm incase he hasn't run npm init already)
    5. automatically installs basic packages (as required by the user)
    
Commands: 
    1. run : run is the biggest command of ez-auth package. You can set up a complete basic project from zero just by answering a few questions.
        "ez-auth run"
    2. setAuth : setup passport js authentication for the providers you select. This sets up the boiler plate in routes folder.
        "ez-auth setAuth"
    3. help : to view all commands and options
    
    
