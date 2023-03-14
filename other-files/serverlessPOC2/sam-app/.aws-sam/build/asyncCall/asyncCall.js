exports.handler = async (event) => {
    let {name} = JSON.parse(event.body)
    console.log("Llamada de tipo asyncrona para " + name)            
}