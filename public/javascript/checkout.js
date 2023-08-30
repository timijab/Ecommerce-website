var shoePrice = document.querySelector('#price').getInnerHTML();
var requestnumber = document.querySelector('#form1').value;
// for first shoe 
// for other shoes
// we need to make the class to match money1 and so on.
var pricesofitem = [];
var listofitems = [];
document.querySelectorAll('#form1').forEach(function(element){
    listofitems.push(element.value);
});

var prices = document.querySelectorAll('#price')

prices.forEach(function(element){

    pricesofitem.push(element.getInnerHTML());
});

console.log(pricesofitem);
console.log(listofitems);