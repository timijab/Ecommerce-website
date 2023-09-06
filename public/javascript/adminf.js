function checker(){
    var inputs = document.querySelectorAll(".item");
    inputs.forEach(element =>{
        if (element.value === ""){
            document.querySelector('#error').classList.remove("hidden");
            document.querySelector('#error').classList.add("show"); 
            event.preventDefault();
            
        }
    })
}