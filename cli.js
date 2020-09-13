#!/usr/bin/env node

const program= require('commander')
const {prompt} = require('inquirer')

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
        name: 'modelLocation',
        message: 'if you are using mongo db, enter absolute location of your models file'
    },

    {
        type: 'checkbox',
        name: 'providers',
        message: 'select auth providers',
        choices:[
            {   
                value: "email",
                checked: true
            },
            {value: "Facebook"}, {value: "Twitter"}, {value: "Github"}, { value: "Google" },             
            
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

const routeSelection=[
    {
        type: 'checkbox',
        name: 'routesRequired',
        message: 'select routes',
        choices:[
            {   
                value: "get",
                checked: true
            },
            {value: "post"}, {value: "update"}, {value: "delete"}, { value: "create" }                        
        ]
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
        type: 'checkbox',
        name: 'scope',
        message: 'select details of user you would require',
        choices:[{
                value: 'profile',
                checked: true
            }, {value: 'contacts'}
        ]
    }
]
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
                    // if(wait) console.log(wait)
                }
            }
            // answers.providers.forEach(pro=>{
            //     console.log(pro)
            //     prompt(providerQuestions).then(answers=>console.log(answers))
            // })
        })
    })

// program
//     .command('cdm')
//     .alias('d')
//     .description("test2")
//     .action(()=>{
//         prompt(advancedQuestions).then(answers=> {
//             // change
//             console.log(answers)
//             answers.providers.forEach(pro=>{
//                 prompt(basicQuestions)
//             })
//         })
//     })

program.parse(process.argv)