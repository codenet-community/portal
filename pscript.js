
    // ——————————————————————————————————————————————————
    //              Firebase configuration
    // ——————————————————————————————————————————————————


        
    const firebaseConfig = {
        apiKey: "AIzaSyBjWCAC_gazDGfozuqC3VOdCYazK_UdPP8",
        authDomain: "portal-bce40.firebaseapp.com",
        databaseURL: "https://portal-bce40-default-rtdb.firebaseio.com/",
        projectId: "portal-bce40",
        storageBucket: "portal-bce40.firebasestorage.app",
        messagingSenderId: "338576186844",
        appId: "1:338576186844:web:1afb2ea6f4464f84708319",
        measurementId: "G-BZ3K2HF01W"
    };

    // Initialize Firebase


    firebase.initializeApp(firebaseConfig);
    const questsportalDB = firebase.database().ref("questsPortal");

    const quests = {
        "Frontend": ["HTML_Basics_Your_First_Webpage"],
        "Backend": ["BACKEND_WEB_DEVLOPMENT_1"],
        "Ui_Ux": ["UI_UX_DESIGN-1"],
        "Game_dev": ["GAME_DEVELOPMENT_1"],
        "App_Dev": ["APP_DEVELOPMENT_01"],
        "competitive_prog": ["COMPETITIVE_PROGRAMMING_1"]
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

        saveBooking(userName, category, quest);
    });

    
// ——————————————————————————————————————————————————
// Save booking to Firebase and trigger file download
// ——————————————————————————————————————————————————



    function saveBooking(userName, category, quest) {
    const questRef = questsportalDB.child(category);
    const newEntryRef = questRef.push();

    const downloadTime = new Date();
    const deadline = new Date();
    deadline.setDate(downloadTime.getDate() + 10);

    // Function to format the date and time
    function formatISTDateTime(date) {
        const options = {
            weekday: 'short', // e.g., Mon
            year: 'numeric',  // e.g., 2024
            month: 'short',   // e.g., Dec
            day: '2-digit',   // e.g., 30
            timeZone: 'Asia/Kolkata',
            timeZoneName: 'short'
        };

        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        };

        const datePart = date.toLocaleDateString('en-US', options);
        const timePart = date.toLocaleTimeString('en-US', timeOptions);

        return `(${datePart}) At (  ${timePart})`;
    }

    // Format both downloadTime and deadline before saving to Firebase
    const formattedDownloadTime = formatISTDateTime(downloadTime);
    const formattedDeadline = formatISTDateTime(deadline);

    newEntryRef.set({
        userName: userName,
        quest: quest,
        downloadedAt: formattedDownloadTime, // Store formatted time
        submissionDeadline: formattedDeadline // Store formatted deadline
    }).then(() => {
        // Update the UI with the formatted times
        document.getElementById("downloadTime").innerText = formattedDownloadTime;
        document.getElementById("submissionDeadline").innerText = formattedDeadline;
        document.getElementById("googleFormLink").href = "#"; // Add the Google Forms link here
        document.getElementById("successMessage").style.display = "block";

        // Trigger file download
        const downloadLink = document.createElement("a");
        downloadLink.href = `./quests/${quest}.pdf`;
        downloadLink.download = `${quest}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }).catch((error) => {
        console.error("Error saving data:", error);
        alert("An error occurred while downloading.");
    });
}


    // Helper function to get input values
    function getElementVal(id) {
        return document.getElementById(id).value;
    }



// ——————————————————————————————————————————————————
//                  EXCEL CONNECTIVITY
// ——————————————————————————————————————————————————


    // Function to export Firebase data to Excel
    function exportToExcel() {
        const category = document.getElementById("exportCategory").value; // Selected category
        const questRef = category ? questsportalDB.child(category) : questsportalDB; // Reference all or specific

        // Fetch data from Firebase
        questRef.once("value")
            .then((snapshot) => {
                const data = snapshot.val();

                if (!data) {
                    alert("No data available.");
                    return;
                }

                // Prepare data for Excel
                const rows = [];

                // Header row
                rows.push(["Key", "Name", "Quest", "Downloaded At", "Submission Deadline"]);

                // Populate rows with data
                Object.entries(data).forEach(([key, value]) => {
                    if (typeof value === 'object') { // Ensure value is a valid object
                        rows.push([
                            key,
                            value.userName || "N/A",
                            value.quest || "N/A",
                            value.downloadedAt || "N/A",
                            value.submissionDeadline || "N/A"
                        ]);
                    }
                });

                // Create a workbook and a worksheet
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.aoa_to_sheet(rows);
                const sheetName = category || "All_Categories";
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

                // Write the Excel file and trigger download
                const excelFileName = `${sheetName}_data.xlsx`;
                XLSX.writeFile(workbook, excelFileName);
            })
            .catch((error) => {
                console.error("Error fetching data for export:", error);
                alert("An error occurred while fetching data for export.");
            });
    }

                
