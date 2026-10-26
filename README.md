# Student Internship Portal

A React and Express application for browsing internships and submitting student applications. Applications are stored in MongoDB using Mongoose.

## Features

- Internship list and details pages with React Router
- Application form for student name, email, roll number, and selected internship
- Required-field and email validation in the browser
- Express API with routes to submit and retrieve applications
- Mongoose schema validation and timestamps
- MongoDB connection configured through `server/.env`

## Run in Nimbus

Run the frontend from the project root:

```bash
npm install
npm run dev