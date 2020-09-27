// functions for actions
const {prompt} = require('inquirer')
const questions= require('./cliQuestions')
const fileFunctions= require('./fileFunctions')
const init= require('./tool')

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
        var providerNames=[]
        var providerData= []
        if(pass || npmAnswers){
            
            for(var i=0;i<answers.providers.length; i++){
                console.log(`\n ${answers.providers[i]} config \n`)
                var wait= await prompt(questions.providerQuestions)
                providerNames.push(answers.providers[i].toLowerCase())
                providerData.push(wait)    
            }
        } 

        if(answers.emailAuth){
            var emailConfig= await prompt(questions.nodemailer)
            providerNames.push('local')
                
            providerData.push(emailConfig)
        }
        
        var configObj={
            MONGODB_URI: answers.mongoUrl,
            PORT: 3000,
            SMTP_USER: providerData[providerData.length-1].email_id,
            SMTP_PASS: providerData[providerData.length-1].password,
            SMTP_HOST: providerData[providerData.length-1].service
        }
        for(var i=0;i<answers.providers.length; i++){
            var tempId= answers.providers[i].toUpperCase()+'_CLIENT_ID'
            var tempSec= answers.providers[i].toUpperCase()+'_CLIENT_SECRET'
            configObj[tempId]= providerData[i].clientId
            configObj[tempSec]= providerData[i].clientSecret
        }
        

        init(answers.unAuthRoutes.split(' '), answers.authRoutes.split(' '), providerNames, configObj, './test')
        
        
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