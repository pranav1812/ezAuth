// functions for actions
const {prompt} = require('inquirer')
const questions= require('./cliQuestions')
const fileFunctions= require('./fileFunctions')

var cliFunctions={}
module.exports= cliFunctions

cliFunctions.runFunction= ()=>{
    prompt(questions.runQuestions).then(async(answers)=> {

        // tool(answers.models.split(' '), answers.authModels.split(' ') )
        var pass= false
        if(answers.npmInit){
            var npmAnswers= await prompt(questions.npmQuestions)
            fileFunctions.packageJson(npmAnswers)    
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

cliFunctions.firebaseFunction=()=>{
    prompt(questions.firebaseSetup).then(async(answers)=>{
        if(answers.services.includes('authentication')){
            var firebaseAuthAnswers= await prompt(questions.firebaseAuth)

        }
        if(answers.services.includes('database')){
            var dbType= await prompt(questions.firebaseDb)
        }
    })
}

cliFunctions.reactFunction=()=>{
    prompt(questions.reactSetup).then(async(answers)=>{
        console.log(answers)
    })
}

cliFunctions.reactFirebaseFunction=async()=>{
    var reactSetupAnswers= await prompt(questions.reactSetup)
    var firebaseAnswers= await prompt(questions.firebaseSetup)

    if(firebaseAnswers.services.includes('authentication')){
        var firebaseAuthAnswers= await prompt(questions.firebaseAuth)

    }
    if(firebaseAnswers.services.includes('database')){
        var dbType= await prompt(questions.firebaseDb)
    }
    if(firebaseAnswers.services.includes('database')){
        console.log("storage bhi milegi")
    }
}