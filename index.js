document.addEventListener("DOMContentLoaded", () => {
    const profileList = document.getElementById("profile-list");
    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const toggleButton = document.querySelector(".toggle-button");
    const profileForm = document.getElementById("profileForm");

    const API_URL = "https://randomuser.me/api/?results=5";
    const LOCAL_API = "http://localhost:3001/profiles"; 

    
    function toggleMode() {
        document.body.classList.toggle("dark-mode");
    }
    toggleButton.addEventListener("click", toggleMode);

    
    async function fetchProfiles() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            const profiles = data.results.map(user => ({
                id: user.login.uuid,
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                bio: "Generated user from API",
                picture: user.picture.medium
            }));

            displayProfiles(profiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        }
    }

    
    function displayProfiles(profiles) {
        profileList.innerHTML = "";
        profiles.forEach(profile => {
            const profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");

            profileCard.innerHTML = `
                <img src="${profile.picture || "https://via.placeholder.com/80"}" alt="Profile Picture">
                <h3>${profile.name}</h3>
                <p>Email: ${profile.email}</p>
                <p>Bio: ${profile.bio}</p>
            `;

            profileList.appendChild(profileCard);
        });
    }


    filterBtn.addEventListener("click", () => {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll(".profile-card").forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            card.style.display = name.includes(searchValue) ? "block" : "none";
        });
    });

    
    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const bio = document.getElementById("bio").value || "No bio available";
        const picture = document.getElementById("picture").value || "https://via.placeholder.com/80";

        const newProfile = { name, email, bio, picture };

        try {
            const response = await fetch(LOCAL_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProfile)
            });

            if (response.ok) {
                console.log("Profile added successfully!");
                fetchProfiles(); 
                profileForm.reset();
            } else {
                console.error("Error adding profile:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    fetchProfiles();
});
