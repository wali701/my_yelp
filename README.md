# Welcome to My Yelp

---

## Task

The task is to create a simple restaurant review app using ReactJS and AWS Amplify, that allows users to:
sign in/sign up and sign out via AWS authentication, and to create, view, and delete restaurant listings. and also
store data using AWS Amplify GraphQL API.

## Description

To solve the problem of managing restaurant listings, this app uses:
ReactJS and its dependencies for the frontend, AWS Amplify for authentication and GraphQL API.
Netlify for deployment.the key Features involved: user authentication using AWS Cognito.
CRUD operations for restaurants, a responsive UI with a background image, and also hosted on Netlify for easy access.

## Installation

Ensure you have the following installed:
Node.js (>= 14.x)
npm or yarn
Git
aws account
AWS Amplify CLI (npm install -g @aws-amplify/cli)
clone the project repository and install the neccessary dependencies
by running npm install

## Usage

After installing the node.js and running npm install for the dependencies, creates the aws account, aws configure, and then configure the
amplify by running: amplify init, follow the steps, then run amplify add auth for the user login and sign up, run amplify push then run amplify
add api to generate the gragpql schema and amplify push to updates the schema. Adjust the necessary files like the app.js and app.css for the styling. Try it locally by running npm start if it works the
run npm run build for the deployment.
Deploy to Netlify:the project was Pushed to GitHub, Connects the repository to Netlify.
Set the build command to npm run build and publish directory to build. After the deployment, the url was generated and copied: https://67b8661b2aeca0a85ec42cd5--storied-rolypoly-ddacfc.netlify.app/

```
./my_yelp
```

### The Core Team

Salaha Abubakar

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
