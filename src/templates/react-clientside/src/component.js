const exportComponent= (componentName, firebase= false)=>{
    return `
      import React, {useState, useEffect} from 'react';
      ${additionalImports(firebase)}

      function ${componentName}() {
        
        // property here is equivalent to state object in class components, 
        // you can store single properties or an object like state, former is the preffered way
        const [property, setProperty]= useState(null)

        useEffect(()=>{
            // code for fetching data from db or any other lifecycle method
            // [] represent an array of property(state) names which when changed will 
            // refresh the component, not the whole page
        }, [])
        return (
          ${returnStatement()}
        );
      }
      
      export default ${componentName};
    `
  }
  
  
  const returnStatement=()=>{
    var rStatement= `
        <div>
            <span>write custom code</span>
        </div>
    `
    
    return rStatement
  }
  
  const additionalImports=(firebase)=>{
    var addImports= ``
    if(firebase){
        addImports+= `import {Fb} from '../firebase.js';\n`
    }
    return addImports
  }


  module.exports= exportComponent
  // console.log(exportComponent("Home"))