// Function to summarize text
function summarizeText() {
  const inputText = document.getElementById("inputText").value;
  const outputTextArea = document.getElementById("outputText");

  if (!inputText.trim()) {
    outputTextArea.value = "Please enter some text to summarize.";
    return;
  }

  // Split text into sentences
  const sentences = inputText.match(/[^.!?]+[.!?]/g) || [];
  if (sentences.length === 0) {
    outputTextArea.value = "No valid sentences found.";
    return;
  }

  // Calculate word frequency
  const wordFrequency = {};
  const words = inputText.toLowerCase().match(/\b[a-z]{3,}\b/g);
  if (words) {
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
  }

  // Score sentences based on word frequency
  const sentenceScores = sentences.map((sentence) => {
    const sentenceWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const score = sentenceWords.reduce(
      (sum, word) => sum + (wordFrequency[word] || 0),
      0
    );
    return { sentence, score };
  });

  // Select top sentences for the summary
  const rankedSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, sentenceScores.length))
    .map((entry) => entry.sentence);

  // Output summary
  outputTextArea.value = rankedSentences.join(" ");
}

// File upload functionality
document.getElementById("fileInput").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("inputText").value = e.target.result;
    };
    reader.readAsText(file);
  } else {
    alert("Please upload a valid text file.");
  }
});

// Download summarized text
document
  .getElementById("downloadButton")
  .addEventListener("click", function () {
    const summary = document.getElementById("outputText").value;
    if (!summary.trim()) {
      alert("No summary available to download!");
      return;
    }
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.txt";
    link.click();
  });

// Share summarized text
document.getElementById("shareButton").addEventListener("click", function () {
  const summary = document.getElementById("outputText").value;
  if (!summary.trim()) {
    alert("No summary available to share!");
    return;
  }
  if (navigator.share) {
    navigator
      .share({
        title: "Text Summary",
        text: summary,
      })
      .then(() => console.log("Summary shared successfully!"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    alert("Your browser does not support the Web Share API.");
  }
});
