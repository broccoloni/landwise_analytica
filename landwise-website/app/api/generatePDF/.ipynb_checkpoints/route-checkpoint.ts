// import puppeteer from "puppeteer";

export async function POST(req: Request) {
  return new Response(JSON.stringify({ message: "API Route not currently available" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
};

//   try {
//     const inputVariables = await req.json();

//     // Render the HTML string dynamically
//     const html = generateHTML(inputVariables);

//     // Launch Puppeteer
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necessary for cloud environments
//     });
//     const page = await browser.newPage();

//     // Set the content of the page
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     // Generate the PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     // Return the PDF as a response
//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=report-${inputVariables.reportId}.pdf`,
//       },
//     });
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return new Response(JSON.stringify({ message: "Failed to generate PDF" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// function generateHTML({
//   reportId,
//   latitude,
//   longitude,
//   address,
//   addressComponents,
//   landGeometry,
//   status,
//   redeemedAt,
//   createdAt,
//   bbox,
//   heatUnitData,
//   growingSeasonData,
//   climateData,
//   elevationData,
//   landUseData,
//   soilData,
//   historicData,
//   projectedData,
//   cropHeatMapData,
// }) {
//   // Generate the HTML string dynamically
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>PDF Report</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           line-height: 1.6;
//           padding: 20px;
//         }
//         h1 {
//           color: #333;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin: 20px 0;
//         }
//         table th, table td {
//           border: 1px solid #ddd;
//           padding: 8px;
//           text-align: left;
//         }
//         table th {
//           background-color: #f4f4f4;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Report: ${reportId}</h1>
//       <p><strong>Latitude:</strong> ${latitude}</p>
//       <p><strong>Longitude:</strong> ${longitude}</p>
//       <p><strong>Address:</strong> ${address}</p>
//       <p><strong>Status:</strong> ${status}</p>
//       <p><strong>Created At:</strong> ${createdAt}</p>
//       <p><strong>Redeemed At:</strong> ${redeemedAt}</p>
//       <h2>Data</h2>
//       <table>
//         <tr>
//           <th>Category</th>
//           <th>Data</th>
//         </tr>
//         <tr>
//           <td>Heat Unit</td>
//           <td>${JSON.stringify(heatUnitData)}</td>
//         </tr>
//         <tr>
//           <td>Growing Season</td>
//           <td>${JSON.stringify(growingSeasonData)}</td>
//         </tr>
//         <tr>
//           <td>Climate</td>
//           <td>${JSON.stringify(climateData)}</td>
//         </tr>
//         <tr>
//           <td>Elevation</td>
//           <td>${JSON.stringify(elevationData)}</td>
//         </tr>
//         <tr>
//           <td>Land Use</td>
//           <td>${JSON.stringify(landUseData)}</td>
//         </tr>
//         <tr>
//           <td>Soil</td>
//           <td>${JSON.stringify(soilData)}</td>
//         </tr>
//         <tr>
//           <td>Historic</td>
//           <td>${JSON.stringify(historicData)}</td>
//         </tr>
//         <tr>
//           <td>Projected</td>
//           <td>${JSON.stringify(projectedData)}</td>
//         </tr>
//         <tr>
//           <td>Crop Heat Map</td>
//           <td>${JSON.stringify(cropHeatMapData)}</td>
//         </tr>
//       </table>
//     </body>
//     </html>
//   `;
// }
