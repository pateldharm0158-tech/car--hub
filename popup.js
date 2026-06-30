function showPopup(title, message, redirect = null) {

let oldPopup = document.getElementById("customPopup");

if (oldPopup) oldPopup.remove();

const popup = document.createElement("div");

popup.id = "customPopup";

popup.innerHTML = `
<div style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.6);
display:flex;
justify-content:center;
align-items:center;
z-index:999999;
">

<div style="
background:#fff;
width:420px;
max-width:90%;
border-radius:25px;
padding:35px;
text-align:center;
box-shadow:0 15px 40px rgba(0,0,0,.3);
position:relative;
animation:popup .3s ease;
">

<span
id="popupClose"
style="
position:absolute;
right:20px;
top:10px;
font-size:35px;
cursor:pointer;
">
&times;
</span>

<h2 style="
font-size:38px;
font-weight:bold;
margin-bottom:20px;
">
${title}
</h2>

<p style="
font-size:20px;
margin-bottom:30px;
">
${message}
</p>

<button
id="popupOk"
style="
background:#dc2626;
color:white;
border:none;
padding:12px 40px;
border-radius:12px;
font-size:18px;
cursor:pointer;
">
OK
</button>

</div>

</div>
`;

document.body.appendChild(popup);
  document.getElementById("popupClose").onclick = function () {
    closePopup(redirect);
};

document.getElementById("popupOk").onclick = function () {
    closePopup(redirect);
};

}

function closePopup(redirect){

document.getElementById("customPopup").remove();

if(redirect){
window.location = redirect;
}

}
