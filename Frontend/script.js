const API_URL = "http://localhost:5000";
async function loadAccounts() {
   try {
      const response = await fetch(`${API_URL}/accounts`);
      const data = await response.json();

      if (data.success) {
         const select = document.getElementById("fromaccountSelect");
         select.innerHTML = "";

         data.accounts.forEach(account => {
            const option = document.createElement("option");
            option.value = account;
            option.textContent = account;
            select.appendChild(option);
         });
      } else {
         console.error("Failed to fetch accounts:", data.error);
      }
   } catch (error) {
      console.error("Error fetching accounts:", error);
   }
}
// Fetch candidates from backend
async function loadCandidates() {
   try {
      const response = await fetch(`${API_URL}/candidates`);
      const candidates = await response.json();
      const select = document.getElementById("candidateList");

      candidates.forEach((candidate, index) => {
         let option = document.createElement("option");
         option.value = index;
         option.text = candidate.name;
         select.appendChild(option);
      });
   } catch (error) {
      console.error("Error loading candidates:", error);
   }
}

// Vote using backend API
async function vote() {
   const candidateIndex = document.getElementById("candidateList").value;
   const voterId = Math.floor(Math.random() * 1000000);
   const account = document.getElementById("fromaccountSelect").value;

   try {
      const response = await fetch(`${API_URL}/vote`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({account, voterId, candidateIndex })
      });

      const data = await response.json();
      document.getElementById("status").innerText = data.message || "Vote Failed";
      fetchVoteCounts();
   } catch (error) {
      console.error("Voting Error:", error);
   }
}

// Fetch vote counts
async function fetchVoteCounts() {
   const voteCountsDiv = document.getElementById("voteCounts");
   voteCountsDiv.innerHTML = "";

   for (let i = 0; i < 3; i++) {
      try {
         const response = await fetch(`${API_URL}/votes/${i}`);
         const data = await response.json();
         voteCountsDiv.innerHTML += `<p>Candidate ${i}: ${data.count} votes</p>`;
      } catch (error) {
         console.error("Error fetching votes:", error);
      }
   }
}

document.getElementById("voteButton").onclick = vote;
window.onload = () => {
   loadAccounts();
   loadCandidates();
   fetchVoteCounts();
};
