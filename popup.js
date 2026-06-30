import {
  db,
  collection,
  addDoc,
  getDocs
} from "./firebase.js";

window.saveReview = async function () {

  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    showLoginPopup();
    return;
  }

  const name = document.getElementById("reviewName").value.trim();
  const review = document.getElementById("reviewText").value.trim();

  if (!name || !review) {
    showPopup(
      "Magneto Carsz",
      "Please fill all fields."
    );
    return;
  }

  try {

    await addDoc(
      collection(db, "reviews"),
      {
        name: name,
        review: review,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      }
    );

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";

    showPopup(
      "Magneto Carsz",
      "Review Added Successfully!"
    );

    loadReviews();

  } catch (error) {

    console.log(error);

    showPopup(
      "Magneto Carsz",
      "Failed to add review."
    );

  }

};

async function loadReviews() {

  const container = document.getElementById("reviewsContainer");

  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "reviews"));

  snapshot.forEach((doc) => {

    const data = doc.data();

    container.innerHTML += `
      <div class="bg-white p-8 rounded-3xl shadow min-w-[350px] max-w-[350px]">

        <img
          src="https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random"
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
