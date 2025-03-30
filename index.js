document.addEventListener("DOMContentLoaded", () => {
    const profileList = document.getElementById("profile-list");
    const searchInput = document.getElementById("searchInput");
    const filterBtn = document.getElementById("filterBtn");
    const toggleButton = document.querySelector(".toggle-button");
    const profileForm = document.getElementById("profileForm");
    const jobContainer = document.getElementById("job-list");

    
    const API_URL = "https://randomuser.me/api/?results=5"; 
    const BACKEND_API = "https://my-app-backend-2-ymkk.onrender.com/profiles"; 
    const JOBS_API = "https://api.allorigins.win/get?url=https://arbeitnow.com/api/job-board-api";

    toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    async function fetchProfiles() {
        profileList.innerHTML = "<p>Loading profiles...</p>";
        try {
            const [backendResponse, apiResponse] = await Promise.all([
                fetch(BACKEND_API, { mode: "cors" }),  
                fetch(API_URL)
            ]);

            const backendData = await backendResponse.json();
            const apiData = await apiResponse.json();

            const apiProfiles = apiData.results.map(user => ({
                id: user.login.uuid,
                name: `${user.name.first} ${user.name.last}`,
                email: user.email,
                jobTitle: "Software Developer", 
                skills: "JavaScript, HTML, CSS", 
                experience: "1-3 years",
                resume: "https://example.com/resume",
                bio: "Generated user from API",
                applicationStatus: "Pending",
                picture: user.picture.medium 
            }));

            displayProfiles([...backendData, ...apiProfiles]);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            profileList.innerHTML = "<p>Error loading profiles.</p>";
        }
    }

    function displayProfiles(profiles) {
        profileList.innerHTML = "";
        profiles.forEach(profile => {
            const profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");

            profileCard.innerHTML = `
                <img src="${profile.picture || 'https://via.placeholder.com/100'}" alt="Profile Picture">
                <h3>${profile.name}</h3>
                <p><strong>Job Title:</strong> ${profile.jobTitle || "Not provided"}</p>
                <p><strong>Skills:</strong> ${profile.skills || "Not provided"}</p>
                <p><strong>Experience:</strong> ${profile.experience || "Not provided"}</p>
                <p><strong>Email:</strong> ${profile.email}</p>
                <p><strong>Resume:</strong> <a href="${profile.resume}" target="_blank">View Resume</a></p>
                <p><strong>Application Status:</strong> ${profile.applicationStatus || "Pending"}</p>
            `;
            profileList.appendChild(profileCard);
        });
    }

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const profileImageInput = document.getElementById("profileImage");
        const profileImageFile = profileImageInput.files[0];
        let imageUrl = "https://via.placeholder.com/100"; 

        if (profileImageFile) {
            imageUrl = URL.createObjectURL(profileImageFile); 
        }

        const newProfile = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            jobTitle: document.getElementById("jobTitle").value.trim(),
            skills: document.getElementById("skills").value.trim(),
            experience: document.getElementById("experience").value.trim(),
            resume: document.getElementById("resume").value.trim(),
            applicationStatus: "Pending",
            picture: imageUrl 
        };

        if (!newProfile.name || !newProfile.email || !newProfile.jobTitle || !newProfile.resume) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            const response = await fetch(BACKEND_API, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProfile)
            });

            if (!response.ok) throw new Error("Failed to add profile");
            fetchProfiles();
            profileForm.reset();
        } catch (error) {
            console.error("Error adding profile:", error);
        }
    });

    async function fetchJobs() {
        jobContainer.innerHTML = "<p>Loading jobs...</p>";
        try {
            const response = await fetch(JOBS_API);
            if (!response.ok) throw new Error("Failed to fetch job listings");

            const result = await response.json();
            const jobData = JSON.parse(result.contents);

            displayJobs(jobData.data);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            jobContainer.innerHTML = "<p>Failed to load job listings.</p>";
        }
    }

    function displayJobs(jobs) {
        jobContainer.innerHTML = "";
        jobs.forEach(job => {
            const jobElement = document.createElement("div");
            jobElement.classList.add("job");
            jobElement.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company_name}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Remote:</strong> ${job.remote ? "Yes" : "No"}</p>
                <a href="${job.url}" target="_blank">View Job</a>
            `;
            jobContainer.appendChild(jobElement);
        });
    }

    filterBtn.addEventListener("click", () => {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll(".profile-card").forEach(card => {
            const name = card.querySelector("h3").textContent.toLowerCase();
            const jobTitle = card.querySelector("p:nth-of-type(1)").textContent.toLowerCase();
            card.style.display = (name.includes(searchValue) || jobTitle.includes(searchValue)) ? "block" : "none";
        });
    });

    fetchProfiles();
    fetchJobs();
});
