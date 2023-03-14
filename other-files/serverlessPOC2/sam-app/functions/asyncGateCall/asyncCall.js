exports.handler = async (event) => {
    let {name} = event
    console.log("Llamada de tipo asyncrona para " + name)            
}