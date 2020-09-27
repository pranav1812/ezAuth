#!/usr/bin/env node
const vrs= '1.0.0'
const program= require('commander')
const cliFunctions= require('./src/cliFunctions')

// hardcoded project info
program
    .version(vrs)
    .description("commandline tool to create a boiler plate for node js and authentication on the top of passport JS, mongoose supported by default")

// commands
program
    .command('run')
    .alias('r')
    .description("setup the complete boiler plate by answering a few questions")
    .action(cliFunctions.runFunction)

program
    .command('reactSetup')
    .alias('rs')
    .description("sets up versatile boiler plate for react")
    .action(cliFunctions.reactFunction)

program
    .command('reactFirebaseSetup')
    .alias('rfs')
    .description("sets up versatile boiler plate for react and firebase for serverless rendering")
    .action(cliFunctions.reactFirebaseFunction)

// program
//     .command('firebaseSetup')
//     .alias('fs')
//     .description("sets up simple firebase boiler plate")
//     .action(cliFunctions.firebaseFunction)

program.parse(process.argv)