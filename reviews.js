import {
db,
collection,
addDoc,
getDocs
} from "./firebase.js";

window.saveReview = async function(){

const name =
document.getElementById("reviewName").value;

const review =
document.getElementById("reviewText").value;

if(!name || !review){
alert("Fill all fields");
return;
}

await addDoc(
collection(db,"reviews"),
{
name,
review,
photo:"https://picsum.photos/80"
}
);

alert("Review Added");

document.getElementById("reviewName").value="";
document.getElementById("reviewText").value="";

loadReviews();
};

async function loadReviews(){

const container =
document.getElementById("reviewsContainer");

container.innerHTML = "";

const snapshot =
await getDocs(collection(db,"reviews"));

snapshot.forEach((doc)=>{

const data = doc.data();

container.innerHTML += `
<div class="bg-white p-8 rounded-3xl">
<img src="${data.photo}" class="w-16 h-16 rounded-full mb-4">
<p class="italic">"${data.review}"</p>
<div class="mt-6 font-semibold">${data.name}</div>
</div>
`;
});

}

loadReviews();
