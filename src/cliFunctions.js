// functions for actions
const {prompt} = require('inquirer')
const questions= require('./cliQuestions')

var cliFunctions={}
module.exports= cliFunctions

cliFunctions.runFunction= ()=>{
    prompt(questions.runQuestions).then(async(answers)=> {

        // tool(answers.models.split(' '), answers.authModels.split(' ') )
        var pass= false
        if(answers.npmInit){
            var npmAnswers= await prompt(questions.npmQuestions)
            console.log(npmAnswers)
        }else{
            pass= true
        }

        if(pass || npmAnswers){
            for(var i=0;i<answers.providers.length; i++){
                console.log(`\n ${answers.providers[i]} config \n`)
                var wait= await prompt(questions.providerQuestions)
                
            }
        }        
    })
}