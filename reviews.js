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
photo:`https://ui-avatars.com/api/?name=${name}&background=random`  
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
<div class="bg-white p-8 rounded-3xl shadow min-w-[350px] max-w-[350px]">

<img src="https://ui-avatars.com/api/?name=${data.name}&background=random"
class="w-20 h-20 rounded-full mx-auto mb-4">


<p class="italic text-gray-600 text-center">
"${data.review}"
</p>

<h3 class="font-bold text-xl text-center mt-4">
${data.name}
</h3>

</div>
`;
});

}

loadReviews();
