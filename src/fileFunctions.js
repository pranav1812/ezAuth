// copy, export, etc 
const fs= require('fs')
const process = require('process')

var fileFunctions= {}
module.exports= fileFunctions

fileFunctions.packageJson= (obj)=>{
    // js object of package into json
    //console.log(`process is running in ${process.cwd()}`)
    obj.keywords= obj.keywords.split(' ')
    jsonString= JSON.stringify(obj, null, 2)

    fs.writeFile(process.cwd() +"/package.json", jsonString, (err)=>{
        if(err) console.log(err)
    })
}

fileFunctions.reactFirebaseSetup=(react, firebase, projectFolderName)=>{
    
    fs.mkdirSync(process.cwd()+'/'+projectFolderName)
    fs.mkdirSync(process.cwd()+'/'+projectFolderName+'/'+'src')
    fs.mkdirSync(process.cwd()+'/'+projectFolderName+'/'+'public')
    fs.mkdirSync(process.cwd()+'/'+projectFolderName+'/'+'src/Components')
    var publicFiles= fs.readdirSync(__dirname+'/templates/react-clientside/public')
    
    for(var i=0; i<publicFiles.length; i++){
        var srcFolder= __dirname+'/templates/react-clientside/public/'
        var locFolder= process.cwd()+'/'+projectFolderName+'/'+'public/'
        fs.copyFileSync(srcFolder+publicFiles[i], locFolder+publicFiles[i])
    }

    var temp= require('./templates/react-clientside/src/index')(react.redux)
    fs.writeFileSync(process.cwd()+'/'+projectFolderName+'/'+'src/index.js', temp)

    temp= require('./templates/react-clientside/src/App')(react.routing)
    fs.writeFileSync(process.cwd()+'/'+projectFolderName+'/'+'src/App.js', temp)

    if(react.routing){
        react.routing.forEach(route=>{
            var comp= require('./templates/react-clientside/src/component')(route, firebase? true: false) 
            fs.writeFileSync(process.cwd()+'/'+projectFolderName+'/'+'src/Components/'+route+'.js', comp)
        })
    }
    
    if(firebase){
        var {firestore, auth, storage, analytics}= firebase
        // console.log(`\n\n${firestore}, ${auth}, ${storage}, ${analytics}\n\n`)
        // store booleans
        var comp= require('./templates/react-clientside/src/firebase')(firestore, auth, storage, analytics)
        fs.writeFileSync(process.cwd()+'/'+projectFolderName+'/'+'src/firebase.js', comp)
    }
}

