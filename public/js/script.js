function showHidePassword() {
  var x = document.getElementById("signUpPassword");
  if (x.type === "password") {
    x.type = "text";
    document.getElementById("passwordToggle").innerHTML = "Hide password";
  } else {
    x.type = "password";
document.getElementById("passwordToggle").innerHTML = "Show password"
  }
  
}


//code that controls modal behaviour of 'search' and 'new post' buttons on the navigation bar
(function() {
var len = document.getElementsByClassName("navModal").length;
var modal=[];
var btn = [];
var span=[];
for(let i =0;i<len;i++){
  modal[i]= document.getElementsByClassName("navModal")[i];
  btn[i] = document.getElementsByClassName("navButton")[i];
  span[i] = document.getElementsByClassName("closeModal")[i];
 

 btn[i].onclick = function() {
  modal[i].style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span[i].onclick = function() {
  modal[i].style.display = "none";
}



window.addEventListener("click", function(event) {
  if (event.target == modal[i]) {
    modal[i].style.display = "none";
  
};
})



}
}());




//code that controls behaviour of modals that are on each blog post when the user wished to delete or edit their own post
(function() {
  console.log(document.getElementsByClassName("editModal").length)
var len = document.getElementsByClassName("editModal").length;
var editModal=[];
var deleteModal=[];
var editbtn = [];
var deletebtn=[];
var close1=[];
var close2=[];
var cancel = [];

for(let i =0;i<len;i++){
  editModal[i]= document.getElementsByClassName("editModal")[i];
  deleteModal[i]= document.getElementsByClassName("deleteModal")[i];
  editbtn[i] = document.getElementsByClassName("editButton")[i];
  deletebtn[i] = document.getElementsByClassName("deleteButton1")[i];
  close1[i] = document.getElementsByClassName("close1")[i];
  close2[i]= document.getElementsByClassName("close2")[i];
  cancel[i]=document.getElementsByClassName("cancelButton")[i];
  
 

 editbtn[i].onclick = function() {
  editModal[i].style.display = "block";
}
deletebtn[i].onclick = function() {
  deleteModal[i].style.display = "block";
}

// When the user clicks on <span> (x), close the modal
close1[i].onclick = function() {
  editModal[i].style.display = "none";
}

close2[i].onclick = function() {
  deleteModal[i].style.display = "none";
}
cancel[i].onclick= function() {
  deleteModal[i].style.display = "none";
}



// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function(event) {
  if (event.target == editModal[i]) {
    editModal[i].style.display = "none";
  
};
})

window.addEventListener("click", function(event) {
  if (event.target == deleteModal[i]) {
    deleteModal[i].style.display = "none";
  
};
})

}
}());