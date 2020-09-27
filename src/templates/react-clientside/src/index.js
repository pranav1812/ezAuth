const exportIndex= (redux= false)=>{
  return `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';

    ${additionalImports(redux)}
    
    ${renderStatement(redux)}
  `
}

const additionalImports= (redux= false)=>{
  var addImports=``
  if(redux){
    addImports+= `import {Provider} from 'react-redux';\n`
    addImports+= `import {createStore} from 'redux';\n`
    addImports+= `import reducer from './reducers/reducer';\n\n`
    addImports+= `const store= createStore(reducer);`
  }
  return addImports
}

const renderStatement=(redux= false)=>{
  var render= ``
  if(!redux){
    render+= `ReactDOM.render(<App />, document.getElementById('root'));`
  }
  else{
    render+= `ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));`
  }
  return render
}

module.exports= exportIndex

// console.log(exportIndex(true))