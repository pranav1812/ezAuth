const exportApp= (routing= false)=>{
  return `
    import React from 'react';
    ${additionalImports(routing)}

    function App() {
      return (
        ${returnStatement(routing)}
      );
    }
    
    export default App;
  `
}



const additionalImports= (routing= false)=>{
  // array of desired routes will be passed to routing if not false
  var addImports=``
  if(routing){
    addImports+= `import {Route, Switch} from 'react-router-dom';\n`
    routing.forEach(route=>{
      addImports+= `import ${route} from './Components/${route}';\n`
    })
  }
  return addImports
}

const returnStatement=(routing= false)=>{
  var rStatement= ``
  if(!routing){
    rStatement+= `
      <div className="App">
        <h1>Hello React</h1>
      </div>
    `
  }
  else{
    rStatement+= `
      <div>
      <Switch>
      `
    routing.forEach(route=>{
      rStatement+= `
        <Route exact path='/${route}' component={${route}}/>\n
      `
    })
    rStatement+= `
      </Switch>
      </div>
      `
  }

  return rStatement
}

module.exports= exportApp
// console.log(exportApp(["Home", "About"]))