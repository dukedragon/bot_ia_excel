console.log(`"path" in {} ${!"path" in {}}`)
console.log(`!"path" in {} ${!("path" in {})}`)
console.log(`!"path" in {path:"hola"} ${!"path" in {path:"hola"}}`)
console.log(`"path" in {path:"hola"} ${"path" in {path:"hola"}}`)