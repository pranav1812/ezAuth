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



program.parse(process.argv)