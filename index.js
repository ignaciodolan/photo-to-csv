const { Textract } = require('@aws-sdk/client-textract');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Create a Textract client
const textract = new Textract({
  credentials: {
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },

  // Set your desired AWS region
  region: process.env.AWS_REGION,
});

// Specify the S3 bucket and object (image) to analyze
const params = {
  DocumentLocation: {
    S3Object: {
      Bucket: process.env.AWS_BUCKET,
      Name: process.env.AWS_FILE_NAME,
    },
  },
};

// Create a CSV writer to store the detected text
const csvWriter = createCsvWriter({
    path: 'output.csv', // Set the path for the CSV file
    header: [
      { id: 'detectedText', title: 'Detected Text' },
    ],
  });
  
  // Array to store detected text
  const detectedTexts = [];
  
// Start the text detection job
textract.startDocumentTextDetection(params, (err, data) => {
  if (err) {
    console.error(err, err.stack);
  } else {
    const jobId = data.JobId;
    console.log(`Started Textract job with ID: ${jobId}`);

    // Poll for the completion of the Textract job
    const checkJobStatus = () => {
      textract.getDocumentTextDetection({ JobId: jobId }, (err, data) => {
        if (err) {
          console.error(err, err.stack);
        } else {
          const jobStatus = data.JobStatus;
          console.log(`Textract job status: ${jobStatus}`);

          if (jobStatus === 'SUCCEEDED') {
            console.log(data)
            for (const item of data.Blocks) {
                if (item.BlockType === 'LINE') {
                  const detectedText = item.Text;
                  detectedTexts.push({ detectedText });
                }
              }
  
              // Write the detected text to the CSV file
              csvWriter.writeRecords(detectedTexts)
                .then(() => console.log('CSV file created with detected text'))
                .catch(error => console.error('Error writing to CSV:', error));
          } else if (jobStatus === 'IN_PROGRESS' || jobStatus === 'PARTIAL_SUCCESS') {
            // Continue polling until the job is complete
            setTimeout(checkJobStatus, 5000); // Poll every 5 seconds
          } else {
            console.log('Textract job failed or was canceled.');
          }
        }
      });
    };

    // Start polling for job completion
    checkJobStatus();
  }
});
