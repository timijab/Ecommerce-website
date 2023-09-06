var buttons = document.querySelectorAll('.addtocart');
var i = 0;
buttons.forEach(element => {
    element.addEventListener('click', function() {
       i++;
       var value = document.querySelector('.fa-solid')
       value.setAttribute('data-count', i);
    //    getting the value from the buttons.
       const buttonValue = element.getAttribute('data-value');
       sendDataToServer(buttonValue);

    });
});
// using Ajax to send to the server side.
// dont forget to enable express use body-parser json.
async function sendDataToServer(value) {
    try {
        const response = await fetch('/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        });
        if (response.ok) {
            console.log('Data sent to server successfully');
        } else {
            console.error('Failed to send data to server');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// animation for the store items 
const observer = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            console.log(entry);
            if (entry.isIntersecting){
                 entry.target.classList.add('show');
            }else{
                entry.target.classList.remove('show');
            }
        })
    }
);
var shopItem = document.querySelectorAll('.hidden');
shopItem.forEach(function(item){
    observer.observe(item);
})

