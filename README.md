# Class Blog Post Application

## Overview
This repository contains a blog post application designed for class students to post questions and receive answers. The application is developed using Python for the backend and DynamoDB for storing blog posts and user data. The frontend is written in JavaScript and uses AJAX for API calls. This project is designed for scalability and low-cost operation, leveraging AWS Lambda for serverless backend operations, API Gateway for RESTful API integration, and AWS S3 for hosting the static frontend.

## Features
- **User Login:** Students can login to their accounts.
- **User Registration:** Students can create new accounts.
- **Post Questions:** Students can easily post their questions through the web interface.
- **Receive Answers:** Answers to questions are managed through the backend and displayed on the frontend.
- **Scalable Backend:** Utilizes AWS Lambda for handling backend operations, ensuring scalability and cost efficiency.
- **Persistent Storage:** Uses DynamoDB for storing user data and blog posts, providing fast and scalable database solutions.
- **Interactive UI:** Frontend developed in JavaScript, offering a responsive and interactive user experience.

## Technology Stack
- **Backend:** Python, AWS Lambda, API Gateway
- **Database:** AWS DynamoDB
- **Frontend:** HTML, CSS, JavaScript, AJAX
- **Deployment:** AWS S3, AWS CloudFormation

## Deployment
The application is fully deployable via CloudFormation which allows easy setup across multiple classes or environments. The CloudFormation template includes all necessary resources such as Lambda functions, API Gateway setup, DynamoDB tables, and S3 bucket configuration for web hosting.

### Prerequisites
- AWS Account
- AWS CLI installed and configured

### Steps to Deploy
1. Clone the repository to your local machine.
2. Navigate to the deployment directory.
3. Use the AWS CLI to deploy the CloudFormation stack:
   ```bash
   aws cloudformation deploy --template-file posts-template.yaml --stack-name BlogPostAppStack --capabilities CAPABILITY_IAM
   aws cloudformation deploy --template-file users-template.yaml --stack-name UserStack --capabilities CAPABILITY_IAM
