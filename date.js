module.exports.date = datem;

function datem() {
    let date = new Date();
    const options= { weekday:'short', month:'long', year:'numeric', day:'numeric'};
    return date.toLocaleDateString('us-en', options);
    
}
module.exports.year = year;    

function year() {
    let date = new Date();
    const options= { year:'numeric'};
    return date.toLocaleDateString('us-en', options)};