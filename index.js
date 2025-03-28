document.addEventListener("DOMContentLoaded", () => {
    const profileList = document.getElementById("profile-list");
    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const toggleButton = document.querySelector(".toggle-button");

    if (!profileList || !searchInput || !filterBtn || !toggleButton) {
        console.error("One or more elements not found! Check your HTML.");
        return;
    }

    // Toggle Light/Dark Mode
    function toggleMode() {
        document.body.classList.toggle("dark-mode");
    }
    toggleButton.addEventListener("click", toggleMode);

    // API URLs
    const jsonServerURL = "https://your-json-server.onrender.com/profiles"; 
    const randomUserAPI = "https://randomuser.me/api/?results=5";

    // Fetch Data from Both Sources
    async function fetchProfiles() {
        try {
            const [jsonResponse, randomResponse] = await Promise.all([
                fetch(jsonServerURL).then(res => res.json()), 
                fetch(randomUserAPI).then(res => res.json())
            ]);

            // Merge Data from Both Sources
            const allProfiles = [...jsonResponse, ...randomResponse.results];
            displayProfiles(allProfiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    }

    function displayProfiles(profiles) {
        profileList.innerHTML = "";
        profiles.forEach(profile => {
            const profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");

            // Handle different data structures from JSON vs API
            const name = profile.name ? `${profile.name.first} ${profile.name.last}` : profile.fullName;
            const email = profile.email;
            const image = profile.picture ? profile.picture.medium : profile.profilePic;
            const bio = profile.bio || "Enthusiastic individual passionate about social media.";

            profileCard.innerHTML = `
                <img src="${image}" alt="Profile Picture">
                <h3>${name}</h3>
                <p>Email: ${email}</p>
                <p>Bio: ${bio}</p>
            `;
            profileList.appendChild(profileCard);
        });
    }

    // Search Functionality
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll(".profile-card").forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = name.includes(searchValue) ? "block" : "none";
        });
    });

    fetchProfiles(); // Load profiles on page load
});
