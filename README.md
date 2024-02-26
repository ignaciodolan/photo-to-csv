# Picture-to-CSV Converter

## Project Overview
This repository contains a tool that extracts content from pictures and outputs the data into a CSV file format using client-textract from AWS. It's designed to automate the process of data extraction from images specifically for receipts, making it easier for users to analyze and work with image data in spreadsheet applications or data analysis tools.

## Installation

### Prerequisites
- Python 3.6 or higher
- Pip package manager
- Node v20.11.1 or higher

### Dependencies
Install all necessary dependencies by running the following command in your terminal:

```bash
npm install
```

Add `.env` file from the `.env.example` and fill the values.

### Running the project
```bash
node --env-file=.env index.js
```

