// we need to make the class to match money1 and so on.
var firstpricesofitem = [];
var prices = document.querySelectorAll('.price')
prices.forEach(function(element){
    firstpricesofitem.push(element.getInnerHTML());
});
console.log(prices);
// sum of first display total price.
// function tots() {
    
// }
// var originaltotalPrice = d3.sum(firstpricesofitem);
// document.querySelector('.subtotal').innerHTML = '€'+originaltotalPrice;

var buttonclicked = document.querySelectorAll('.left');
buttonclicked.forEach(function(element){
    element.addEventListener('click', function() {
        var quantity = [];
        // specifc quantity required.
        document.querySelectorAll('#form1').forEach(function(element){
            quantity.push(element.value);
        });
        // price of item. 
        // specific button pressed
        var callerbutton = element.getAttribute('data-value');
        
        // calcualtion bug not an
        var customerquantity = quantity[callerbutton];
        
        let result = firstpricesofitem[callerbutton] * customerquantity;
        document.querySelector('#price'+callerbutton).innerHTML = result;
        
        // total new price
        var pricesofitem = [];
        var prices = document.querySelectorAll('.price')
        prices.forEach(function(element){
            pricesofitem.push(element.getInnerHTML());
        });
        const totalPrice = d3.sum(pricesofitem);
        console.log('reached');
        document.querySelector('.subtotal').innerHTML = totalPrice;
        let symbol = '€';
        document.querySelector('.check').innerHTML = symbol + totalPrice;
        });
});


var buttonclickedright = document.querySelectorAll('.right');
buttonclickedright.forEach(function(element){
    element.addEventListener('click', function() {
        
        var quantityr = [];
        // specifc quantity required.
        document.querySelectorAll('#form1').forEach(function(element){
            quantityr.push(element.value);
        });
        
        var callerbutton = element.getAttribute('data-value');
        // calcualtion bug not an
        console.log(callerbutton);
        // we use the original price to determine new prices.
        // var answer = pricesofitemr[callerbutton] * quantityr[callerbutton];
        var answer = firstpricesofitem[callerbutton] * quantityr[callerbutton];
        document.querySelector('#price'+callerbutton).innerHTML = answer;
        // new price of item. 
        var pricesofitemr = [];
        var prices = document.querySelectorAll('.price');
        prices.forEach(function(element){
            pricesofitemr.push(element.getInnerHTML());
        });
        const sPrice = d3.sum(pricesofitemr);
        console.log('reached number 2');
        // this one isnt changing
        document.querySelector('.subtotal').innerHTML = sPrice;
        let symbol = '€';
        document.querySelector('.check').innerHTML =  symbol + sPrice;
        });

    });
