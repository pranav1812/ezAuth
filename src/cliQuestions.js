// questions to be asked from user
var questions={}
module.exports= questions

questions.runQuestions= [
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

questions.npmQuestions=[  
    {
        type: 'input',
        name: 'name',
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
        name: 'main',
        message: 'entry point',
        default: 'index.js'
    },
    {
        type: 'input',
        name: 'keywords',
        message: 'keywords'
    },
    {
        type: 'input',
        name: 'author',
        message: 'author'
    },
    {
        type: 'input',
        name: 'licence',
        message: 'licence',
        default: 'ISC'
    }
]

questions.routeSelection=[
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

questions.providerQuestions=[
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