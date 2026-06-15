import {
db,
collection,
addDoc,
getDocs
} from "./firebase.js";

window.addReview = async function () {

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
name:name,
review:review,
photo:"https://picsum.photos/80"
}
);

alert("Review Added");

loadReviews();
}

async function loadReviews(){

const container =
document.getElementById("reviewsContainer");

container.innerHTML = "";

const snapshot =
await getDocs(collection(db,"reviews"));

snapshot.forEach((doc)=>{

const data = doc.data();

container.innerHTML += `
<div class="bg-white p-6 rounded-3xl shadow">

<img src="${data.photo}"
class="w-20 h-20 rounded-full mx-auto mb-4">

<p class="italic mb-4">
"${data.review}"
</p>

<h3 class="font-bold text-xl">
${data.name}
</h3>

</div>
`;
});

}

loadReviews();
