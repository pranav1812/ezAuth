#!/usr/bin/env node

const program= require('commander')
const {prompt} = require('inquirer')

const basicQuestions= [
    {
        type: 'input',
        name: 'first name',
        message: 'enter first name',
        default: 'Pranav'
    },

    {
        type: 'input',
        name: 'last name',
        message: 'enter last name',
        default: 'Vohra'
    }
]

const advancedQuestions=[  
    ...basicQuestions,  
    {
        type: 'checkbox',
        name: 'providers',
        message: 'select auth providers',
        choices:[
            {   
                value: "Google",
                checked: true
            },
            {   
                value: "email",
                checked: true
            },
            {   
                value: "Facebook"               
            }
        ]
    }
    
]

// hardcoded project info
program
    .version('1.0.0')
    .description("commandline tool to create a boiler plate for node js and authentication on the top of passport JS, mongoose supported by default")

// commands
program
    .command('cmd')
    .alias('c')
    .description("test")
    .action(()=>{
        prompt(basicQuestions).then(answers=> console.log(answers))
    })

program
    .command('cdm')
    .alias('d')
    .description("test2")
    .action(()=>{
        prompt(advancedQuestions).then(answers=> {
            // change
            console.log(answers)
            answers.providers.forEach(pro=>{
                console.log(pro)
            })
        })
    })

program.parse(process.argv)