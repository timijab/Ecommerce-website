window.onload = function() {
    document.querySelector('.this').onclick=function() {
        var password = document.querySelector('.respassward').value;
        var secondpassword = document.querySelector('.epassword').value;
        
        if (password == ''){
            alert("password cannot be empty");
            
        } else if (password != secondpassword){
            alert('The password does not match');
            
        }
        // rather than alert we display a text field.
    } 
}   