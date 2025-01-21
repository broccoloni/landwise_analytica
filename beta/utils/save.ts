export const saveData = (data: any, filename = 'data.json') => {
  // Create a Blob from the JSON data
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  // Create a temporary URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append link to the body, trigger click, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the URL after download
  URL.revokeObjectURL(url);
};