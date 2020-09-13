#!/usr/bin/env node

const program= require('commander')
const {prompt} = require('inquirer')

// send questions to src/cliQuestions.js
const runQuestions= [
    {
        type: 'confirm',
        name: 'npmInit',
        message: 'do you want to initialise npm? : enter y if you have not run npm init yet... ',
        default: false
    },

    {
        type: 'confirm',
        name: 'mongo',
        message: 'are you using mongo db? : mongoose will be used',
        default: true
    },

    {
        type: 'input',
        name: 'authModels',
        message: 'names of models (or collections you want authenticated)'
    },

    {
        type: 'input',
        name: 'unAuthModels',
        message: 'names of models (or collections you don\'t want authenticated)'
    },

    {
        type: 'input',
        name: 'cookieSecret',
        message: 'enter a cookie secret for basic server setup'
    },

    {
        type: 'confirm',
        name: 'email',
        message: 'do you want email login?',
        default: false
    },

    {
        type: 'checkbox',
        name: 'providers',
        message: 'select external auth providers',
        choices:[
            {value: "Facebook"}, {value: "Twitter"}, {value: "Github"}, { value: "Google" }                       
        ]
    }
]

const npmQuestions=[  
    {
        type: 'input',
        name: 'packageName',
        message: 'package name',
        default: 'sample-project'
    },
    {
        type: 'input',
        name: 'version',
        message: 'version',
        default: '1.0.0'
    },
    {
        type: 'input',
        name: 'description',
        message: 'description'
    },
    {
        type: 'input',
        name: 'entry',
        message: 'entry point',
        default: 'index.js'
    },
    {
        type: 'input',
        name: 'git',
        message: 'git repository'
    },
    {
        type: 'input',
        name: 'author',
        message: 'author'
    },
    {
        type: 'input',
        name: 'licence',
        message: 'licence'
    },
    {
        type: 'confirm',
        name: 'ok',
        message: 'package.json file will be created with the creadentials you provided. You can always edit it...',
        default: true
    }
]


const providerQuestions=[
    {
        type: 'input',
        name: 'access',
        message: 'access key'
    },
    {
        type: 'input',
        name: 'secret',
        message: 'secret key'
    },
    {
        type: 'input',
        name: 'callbackUrl',
        message: 'callback url',
        default: 'http://localhost:3000/'
    },
    
]

// const smtpQuestions=[
//     {
//         type: 'input',
//         name: 'mail'
//     }
// ]

// hardcoded project info
program
    .version('1.0.0')
    .description("commandline tool to create a boiler plate for node js and authentication on the top of passport JS, mongoose supported by default")

// commands
program
    .command('run')
    .alias('r')
    .description("setup the complete boiler plate by answering a few questions")
    .action(()=>{
        prompt(runQuestions).then(async(answers)=> {
            var pass= false
            if(answers.npmInit){
                var npmAnswers= await prompt(npmQuestions)
                console.log(npmAnswers)
            }else{
                pass= true
            }

            if(pass || npmAnswers){
                for(var i=0;i<answers.providers.length; i++){
                    console.log(`\n ${answers.providers[i]} config \n`)
                    var wait= await prompt(providerQuestions)
                    // logic on wait
                }
            }
            
        })
    })



program.parse(process.argv)