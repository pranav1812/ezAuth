const exportFirebase= (firestore= false, auth= false, storage= false, analytics= false)=>{
    return `
        import * as firebase from 'firebase;
        ${additionalImports(firestore, auth, storage, analytics)}

        export const app= firebase.initializeApp(firebaseConfig)
        const firebaseConfig={
            // copy the config object from your firebase console. 
            // ...
        } 

        export const Fb={
            app: firebase.initializeApp(firebaseConfig),
            db: firebase.firestore(),
            auth: firebase.auth(),
            storage: firebase.storage(),
        
            dbCollectionGetAllDocs: (collection)=>{
                firebase.firestore().collection(collection).get(snapshot=>{
                    var data= []
                    var temp= []
                    snapshot.forEach(doc=>{
                        temp.push({
                            docId: doc.id,
                            ...doc.data()
                        })
                    })
                    data= temp
                    return data 
                })
            },
            
            dbCollectionGetAllDocs: (collection, query)=>{
                // sample format for query-> var qry= '"state", "==", "done"', 
                // It is like a list of words not enclosed within []
                firebase.firestore().collection(collection).where(query).get(snapshot=>{
                    var data= []
                    var temp= []
                    snapshot.forEach(doc=>{
                        temp.push({
                            docId: doc.id,
                            ...doc.data()
                        })
                    })
                    data= temp
                    return data 
                })
            },
        
            dbCollectionGetDoc: (collection, doc)=>{
                firebase.firestore().collection(collection).doc(doc).get(doc=>{
                    if(doc.exists){
                        return {
                            docId: doc.id,
                            ...doc.data()
                        }
                    }else{
                        // rather raise an error
                        console.error("doc not found")
                    }
                })
            },
            // you can define methods for getting data from subcollections like: 
            // db.collection().doc().collection().doc().get()
            
            dbCollectionSetDoc: (collection, doc, dataObj, callback= null)=>{
                firebase.firestore().collection(collection).doc(doc).set(...dataObj)
                    .then(()=>{
                        if(callback){
                            callback()
                        }else return 
                    })
                    .catch(err=> console.error(err))
            },
        
            dbCollectionCreateDoc: (collection, dataObj, callback= null)=>{
                firebase.firestore().collection(collection).add(...dataObj)
                    .then((doc)=>{
                        if(callback){
                            callback()
                            return doc.id
                        }else return 
                    })
                    .catch(err=> console.error(err))
            },
        
            dbCollectionUpdateDoc: (collection, doc, dataObj, callback= null)=>{
                firebase.firestore().collection(collection).doc(doc).update({...dataObj})
                    .then(()=>{
                        if(callback){
                            callback()
                        }else return 
                    })
                    .catch(err=> console.error(err))
            },
        
            dbCollectionDeleteDoc: (collection, doc, callback= null)=>{
                firebase.firestore().collection(collection).doc(doc).delete()
                    .then(()=>{
                        if(callback){
                            callback()
                        }else return 
                    })
                    .catch(err=> console.error(err))
            }
        
        }

    `
}

const additionalImports= (firestore, auth, storage, analytics)=>{
    var addImports= ``
    if (firestore)
        addImports+= `\timport 'firebase/firestore';\n`
    if (auth)
        addImports+= `\timport 'firebase/auth';\n`
    if (storage)
        addImports+= `\timport 'firebase/storage';\n`
    if (analytics)
        addImports+= `\timport 'firebase/analytics';\n`
    
    return addImports
}
console.log(exportFirebase(true, true, true))