const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");


hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent the click from reaching document
    navLinks.classList.toggle("active");
});

// Close menu if click is outside menu or hamburger
document.addEventListener("click", (e) => {
    if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        navLinks.classList.remove("active");
    }
});

