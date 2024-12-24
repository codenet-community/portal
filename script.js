// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjWCAC_gazDGfozuqC3VOdCYazK_UdPP8",
    authDomain: "portal-bce40.firebaseapp.com",
    databaseURL: "https://portal-bce40-default-rtdb.firebaseio.com/",
    projectId: "portal-bce40",
    storageBucket: "portal-bce40.appspot.com",
    messagingSenderId: "338576186844",
    appId: "1:338576186844:web:1afb2ea6f4464f84708319",
    measurementId: "G-BZ3K2HF01W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const questsPortalDB = firebase.database().ref("questsportal");

const quests = {
    "Programming": ["Python Basics", "Web Development", "Data Structures"],
    "Design": ["UI/UX Design", "Graphic Design", "Logo Creation"],
    "Writing": ["Content Writing", "Blog Posts", "Copywriting"],
    "Marketing": ["Social Media Campaign", "SEO Optimization", "Email Marketing"],
    "Management": ["Task Coordination", "Event Planning", "Team Management"]
};

// Populate quests based on category selection
document.getElementById("categorySelect").addEventListener("change", function () {
    const category = this.value;
    const questSelect = document.getElementById("questSelect");

    questSelect.innerHTML = '<option value="" disabled selected>Select Quest</option>';

    if (quests[category]) {
        quests[category].forEach((quest) => {
            const option = document.createElement("option");
            option.value = quest;
            option.textContent = quest;
            questSelect.appendChild(option);
        });
    }
});

// Handle form submission
document.getElementById("questPortalForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = getElementVal("userName");
    const category = getElementVal("categorySelect");
    const quest = getElementVal("questSelect");

    if (!userName || !category || !quest) {
        alert("All fields are required!");
        return;
    }

    // Get the current timestamp
    const downloadTimestamp = new Date().toISOString();
    const submissionDeadline = calculateSubmissionDeadline(downloadTimestamp);

    // Save the quest details to Firebase
    saveQuestDownload(userName, category, quest, downloadTimestamp, submissionDeadline);

    // Update UI with the success message and timestamps
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("downloadTime").textContent = new Date(downloadTimestamp).toLocaleString();
    document.getElementById("submissionDeadline").textContent = new Date(submissionDeadline).toLocaleDateString();
});

// Save download details to Firebase
function saveQuestDownload(userName, category, quest, downloadTimestamp, submissionDeadline) {
    const questRef = questsPortalDB.child(`${category}/${quest}`);
    questRef.push({
        userName: userName,
        downloadTime: downloadTimestamp,
        submissionDeadline: submissionDeadline
    }).catch((error) => {
        console.error("Error saving download details:", error);
        alert("An error occurred while saving the download details.");
    });
}

// Calculate submission deadline (3 days from download time)
function calculateSubmissionDeadline(downloadTimestamp) {
    const downloadDate = new Date(downloadTimestamp);
    downloadDate.setDate(downloadDate.getDate() + 3);
    return downloadDate.toISOString();
}

// Helper function to get input values
function getElementVal(id) {
    return document.getElementById(id).value;
}