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

    fs.writeFile(process.cwd() +"/drop/package.json", jsonString, (err)=>{
        if(err) console.log(err)
    })
}


