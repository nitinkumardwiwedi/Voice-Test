"use client";

export default function DownloadTxt() {
  const downloadTxt = () => {
    const text = `==============================
      DEMO TEXT FILE
==============================

Name: Nitin
Project: Next.js Application
Date: 2025-12-31

This is a demo text file.
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "demo.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadTxt}>Download TXT</button>;
}
