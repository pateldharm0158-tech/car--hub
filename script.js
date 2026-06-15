import {
  db,
  collection,
  getDocs
} from "./firebase.js";

window.cars = [];
let cars = window.cars;

async function loadCarsFromFirestore() {

  const querySnapshot =
    await getDocs(collection(db, "cars"));

window.cars = [];
cars = window.cars;
  
  querySnapshot.forEach((docSnap, index) => {

    const data = docSnap.data();

    cars.push({
      id: index + 1,
      name: data.carName,
      price: data.price,
      fuel: data.fuel,
      trans: data.trans,
      makeYear: data.makeYear,
      registrationYear: data.registrationYear,
      ownership: data.ownership,
      driven: data.driven,
      rto: data.rto,
      insurance: data.insurance,
      color: data.color,
      img: data.images?.[0] || "",
      images: data.images || [],
      numericPrice:
        parseInt(String(data.price).replace(/[^\d]/g, "")) || 0
    });

  });

renderCars();
window.cars = cars;
}



    function renderCars() {
      const grid = document.getElementById('car-grid');
      grid.innerHTML = cars.map(car => `
<div onclick="window.openCarModal(${car.id})"
class="car-card bg-white rounded-3xl overflow-hidden cursor-pointer">
<img src="${car.img}" class="w-full h-48 sm:h-56 object-cover">         
           <div class="p-4">

<h3 class="font-bold text-lg mb-3">
${car.name}
</h3>

<div class="grid grid-cols-3 gap-2 mb-4">

<div class="bg-gray-100 text-center py-2 rounded-lg text-sm">
${car.fuel}
</div>

<div class="bg-gray-100 text-center py-2 rounded-lg text-sm">
${car.trans}
</div>

<div class="bg-gray-100 text-center py-2 rounded-lg text-sm">
${car.rto}
</div>

</div>

<div class="flex justify-between items-center">

<div>
<p class="text-red-600 text-3xl font-bold">
${car.price}
</p>
</div>

<div class="text-sm font-semibold">
EMI: ₹${Math.round(car.numericPrice/120).toLocaleString('en-IN')}/m
</div>

</div>

<button
onclick="event.stopPropagation(); addToWishlist(${car.id})"
class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg wishlist-btn">
❤️ Wishlist
</button>

</div>
        </div>
      `).join('');
    }

    let currentCar = null;
    let currentImageIndex = 0;
    let slideInterval;

    function openCarModal(id) {
      currentCar = cars.find(c => c.id === id);
      if (!currentCar) return;
        
    const whatsappBtn = document.querySelector('a[href*="wa.me"]');
const callBtn = document.querySelector('a[href*="tel:"]');

if (whatsappBtn) whatsappBtn.style.display = "none";
if (callBtn) callBtn.style.display = "none";
      document.getElementById('modal-car-name').textContent = currentCar.name;
      document.getElementById('modal-price').textContent = currentCar.price;
      document.getElementById("detail-makeyear").textContent = currentCar.makeYear;
      document.getElementById("detail-regyear").textContent = currentCar.registrationYear;
      document.getElementById("detail-owner").textContent = currentCar.ownership;
      document.getElementById("detail-fuel").textContent = currentCar.fuel;
      document.getElementById("detail-driven").textContent = currentCar.driven;
      document.getElementById("detail-rto").textContent = currentCar.rto;
      document.getElementById("detail-transmission").textContent = currentCar.trans;
      document.getElementById("detail-insurance").textContent = currentCar.insurance;
      document.getElementById("detail-color").textContent = currentCar.color;  
      document.getElementById('car-price-display').textContent = currentCar.price;

      document.getElementById('main-image').src = currentCar.images[0];
        currentImageIndex = 0;
         startAutoSlide();
      const thumbGrid = document.getElementById('thumbnail-grid');
      thumbGrid.innerHTML = currentCar.images.map(img => `
        <img src="${img}" onclick="changeImage('${img}')" class="w-full h-20 object-cover rounded-xl cursor-pointer hover:ring-2 hover:ring-red-500">
      `).join('');

      document.getElementById('carModal').classList.remove('hidden');
        renderRelatedCars(id);
      
      // Reset sliders based on car price
      const price = currentCar.numericPrice;
      const defaultDown = Math.round(price * 0.2);
      const defaultLoan = price - defaultDown;

      document.getElementById('down-payment').max = Math.round(price * 0.8);
      document.getElementById('down-payment').value = defaultDown;
      document.getElementById('loan-amount').max = price;
      document.getElementById('loan-amount').value = defaultLoan;

      updateEMI();
    }

   function changeImage(src) {
  document.getElementById('main-image').src = src;
  currentImageIndex = currentCar.images.indexOf(src);
}
    function nextImage() {
  if (!currentCar) return;

  currentImageIndex++;

  if (currentImageIndex >= currentCar.images.length) {
    currentImageIndex = 0;
  }

  document.getElementById("main-image").src =
    currentCar.images[currentImageIndex];
}

function prevImage() {
  if (!currentCar) return;

  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = currentCar.images.length - 1;
  }

  document.getElementById("main-image").src =
    currentCar.images[currentImageIndex];
}




function startAutoSlide() {
  clearInterval(slideInterval);

  slideInterval = setInterval(() => {
    nextImage();
  }, 3000);
}

   function closeModal() {
  clearInterval(slideInterval);

 const whatsappBtn = document.querySelector('a[href*="wa.me"]');
const callBtn = document.querySelector('a[href*="tel:"]');

if (whatsappBtn) whatsappBtn.style.display = "flex";
if (callBtn) callBtn.style.display = "flex";
  document.getElementById('carModal').classList.add('hidden');
}
    // Fixed & Linked EMI Calculator
    function updateEMI(type = '') {
      let loanAmount = parseFloat(document.getElementById('loan-amount').value);
      let downPayment = parseFloat(document.getElementById('down-payment').value);
      const tenureYears = parseFloat(document.getElementById('tenure').value);
      const carPrice = currentCar ? currentCar.numericPrice : 1875000;

      // Link both sliders
      if (type === 'down') {
  loanAmount = carPrice - downPayment;
  document.getElementById('loan-amount').value = loanAmount;
}

if (type === 'loan') {
  downPayment = carPrice - loanAmount;
  document.getElementById('down-payment').value = downPayment;
}

      const principal = loanAmount;
      const annualRate = 9.0;
      const monthlyRate = annualRate / 12 / 100;
      const tenureMonths = tenureYears * 12;

      let emi = 0;
      if (monthlyRate > 0) {
        emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
              (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      }

      const totalPayment = emi * tenureMonths;
      const totalInterest = totalPayment - principal;

      // Update displays
      document.getElementById('loan-amount-display').textContent = '₹' + Math.round(loanAmount).toLocaleString('en-IN');
      document.getElementById('down-payment-display').textContent = '₹' + Math.round(downPayment).toLocaleString('en-IN');
      document.getElementById('tenure-display').textContent = tenureYears + ' years';
      document.getElementById('monthly-emi').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
      document.getElementById('principal').textContent = '₹' + Math.round(principal).toLocaleString('en-IN');
      document.getElementById('total-interest').textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
      document.getElementById('total-payment').textContent = '₹' + Math.round(totalPayment).toLocaleString('en-IN');
    }

    // Other functions (callNow, bookNow, handleForm, renderFAQ) remain same
    function callNow() { window.location.href = "tel:+919328216168"; }
    function bookNow() { alert("✅ Booking request received!"); }
    function handleForm(e) { e.preventDefault(); alert("✅ Thank you!"); e.target.reset(); }

    // FAQ
    const faqs = [
      {q: "How can I contact Magneto Carsz?", a: "Call us at +91 93282-16168 or WhatsApp anytime."},
      {q: "Do cars come with warranty?", a: "Yes, all cars come with minimum 6 months warranty."},
      {q: "Can I take a test drive?", a: "Yes, test drive is available at our showroom."},
      {q: "Do you provide RC transfer?", a: "Yes, we handle complete documentation and RC transfer."},
      {q: "What about financing options?", a: "We work with all major banks for easy EMI options."},
      {q: "Can I sell my old car?", a: "Yes, we offer best price for your old car."}
    ];

function renderFAQ() {

const container =
document.getElementById('faq-container');

container.innerHTML = faqs.map(faq => `

<div class="bg-white rounded-3xl shadow-lg overflow-hidden">

<button
class="w-full flex justify-between items-center p-6 text-left"
onclick="this.nextElementSibling.classList.toggle('hidden')">

<span class="text-xl font-bold">
${faq.q}
</span>

<span class="text-2xl">
+
</span>

</button>

<div class="hidden px-6 pb-6 text-gray-600 text-lg">
${faq.a}
</div>

</div>

`).join('');

}
function searchCars() {
  const input = document.getElementById("searchInput").value.toLowerCase();

  document.querySelectorAll(".car-card").forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}


let wishlist = [];

function addToWishlist(id) {
  const car = cars.find(c => c.id === id);

  if (!wishlist.some(item => item.id === id)) {
    wishlist.push(car);
    alert(car.name + " added to Wishlist ❤️");
  }
}

function showWishlist(){

document.getElementById("wishlistPage")
.classList.remove("hidden");

const grid =
document.getElementById("wishlistGrid");

if(wishlist.length===0){
grid.innerHTML =
"<h2 class='text-2xl'>No Cars In Wishlist ❤️</h2>";
return;
}

grid.innerHTML = wishlist.map(car => `
<div class="bg-white rounded-2xl shadow-lg overflow-hidden">

<img src="${car.img}"
class="w-full h-60 object-cover">

<div class="p-4">

<h3 class="font-bold text-xl">
${car.name}
</h3>

<p class="text-red-600 text-2xl mt-2">
${car.price}
</p>

<button
onclick="removeWishlist(${car.id})"
class="mt-4 bg-black text-white px-4 py-2 rounded-lg">
Remove
</button>

</div>
</div>
`).join('');
}
    function closeWishlist(){
document.getElementById("wishlistPage")
.classList.add("hidden");
}

function removeWishlist(id){

wishlist =
wishlist.filter(car => car.id !== id);

showWishlist();
}

function openSearch() {
  document.getElementById("searchModal").classList.remove("hidden");

  const grid = document.getElementById("searchCarsGrid");

  grid.innerHTML = cars.map(car => `
    <div class="bg-white rounded-2xl shadow overflow-hidden">
      <img src="${car.img}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-bold">${car.name}</h3>
        <p class="text-red-600 font-bold">${car.price}</p>
      </div>
    </div>
  `).join('');
}

function closeSearch() {
  document.getElementById("searchModal").classList.add("hidden");
}

function filterCars() {
  const search = document.getElementById("modalSearch").value.toLowerCase();

  const filtered = cars.filter(car =>
    car.name.toLowerCase().includes(search)
  );

  document.getElementById("searchCarsGrid").innerHTML =
    filtered.map(car => `
      <div class="bg-white rounded-2xl shadow overflow-hidden">
        <img src="${car.img}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="font-bold">${car.name}</h3>
          <p class="text-red-600 font-bold">${car.price}</p>
        </div>
      </div>
    `).join('');
}


function openWarrantyModal(){
document.getElementById("warrantyModal")
.classList.remove("hidden");
}

function closeWarrantyModal(){
document.getElementById("warrantyModal")
.classList.add("hidden");
}

function renderRelatedCars(currentId){

const related =
cars.filter(car => car.id !== currentId)
.slice(0,3);

document.getElementById("relatedCars").innerHTML =
related.map(car => `




<div onclick="window.openCarModal(${car.id})"
class="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer">

<img src="${car.img}"
class="w-full h-52 object-cover">

<div class="p-4">

<h3 class="font-bold text-lg">
${car.name}
</h3>

<p class="text-red-600 text-2xl font-bold mt-2">
${car.price}
</p>

</div>

</div>

`).join('');
}
function shareWebsite() {
  if (navigator.share) {
    navigator.share({
      title: "Magneto Carsz",
      text: "Check out premium pre-owned cars at Magneto Carsz",
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Website link copied!");
  }
}
    
    
  window.onload = async () => {
  await loadCarsFromFirestore();
  renderFAQ();
};
function toggleMenu(){

document
.getElementById("mobileMenu")
.classList.toggle("hidden");

}

window.openCarModal = openCarModal;
window.cars = cars;
window.addToWishlist = addToWishlist;
window.closeModal = closeModal;
window.showWishlist = showWishlist;
window.closeWishlist = closeWishlist;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.filterCars = filterCars;
window.changeImage = changeImage;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.callNow = callNow;
window.bookNow = bookNow;
window.toggleMenu = toggleMenu;
window.renderCars = renderCars;
window.renderRelatedCars = renderRelatedCars;
