# Mamaput E-Shop Backend

This project is a responsive e-commerce platform for a clothing line. This includes front-end and back-end development, Stripe and PayPal payment gateway, authentication system, Email notification, OpenStreetMap and Clouinary API intgration, as well as MongoDB Atlas database integration.

## Getting Started

To get started with this project, you will need to have the following tools and technologies installed with the specified versions:

- git (>= version 2.34.1.windows.1)
- Node.js (>= version 18.2.1)
- npm (>= version 9.2.1)
- MongoDB (>= version 6.0.2)

## Installation Backend

Clone the repository using:

`git clone https://github.com/SamsonOvbi/mamaput-eshop.git`

After cloning, navigate to the backend directory:
`cd mamaput-eshop/backend`

Install the required dependencies:
`npm install`

To start the application, run the following command in your terminal:
`npm start`
This will start the server and the application will be accessible at <http://localhost:3000>.

## Usage

To use this project, follow the instructions below:

### How to Use the Application

Once the server is running, you can interact with the application through its various endpoints. Here are a few examples of common operations you might want to perform:

User Authentication: Send a POST request to `/login` to authenticate users.
User Registration: Send a POST request to `/register` to register new users.
View Products: Send a GET request to `/api/products` to retrieve a list of available products.
Add a Product: Use a POST request to `/api/products` with product details in the request body to add a new product.
Update a Product: Send a PUT request to `/api/products/{id}` with updated product details.
Delete a Product: Send a DELETE request to `/api/products/{id}` to remove a product.

## Features

The features of the Mamaput E-Shop Backend project are:

- User authentication
- CRUD operations
- Database integration
- Responsive design

## Contributing

If you would like to contribute to this project, please adhere to the following guidelines.

### Fork the repository

To fork the repository and contribute with your changes, follow these steps:

Navigate to the original repository on GitHub.
Click on the 'Fork' button at the top right corner to create a copy of the repository in your GitHub account.

### Merge the latest changes from the original repository into your forked repository

Before creating a new branch, it is recommended to merge the latest changes from the original repository into your forked repository. This ensures that you are working with the most up-to-date codebase. You can do this by following these steps:

1. Add the original repository as a remote to your forked repository:

   `git remote add upstream https://github.com/original-username/original-repository.git`

2. Fetch the latest changes from the original repository:

   `git fetch upstream`

3. Rebase your local branch onto the latest changes from the original repository:

   `git rebase upstream/main`

4. Push the rebased changes to your forked repository:

   `git push origin main`

### Clone your forked repository to your local machine using

`git clone https://github.com/your-username/repository-name.git`

### Create a new branch for your changes

`git checkout -b your-branch-name`

### Make your changes in the new branch

Commit your changes with a descriptive message:
`git commit -m "Add your descriptive commit message"`

### Push your branch to your forked repository

`git push origin your-branch-name`

Go to your repository on GitHub. You will see a 'Compare & pull request' button. Click on it.
Add a title and description to your pull request explaining your changes and submit it.
This process will allow you to propose changes to the project and potentially have them integrated into the main codebase.

## Command to build the project

`npm run build`

## Command to run tests

`npm test`

## Credits

[Basir angular-amazona-final](https://github.com/basir/angular-amazona-final.git)

[Slobodan Gajic: Build a Webshop - Node.js, TypeScript, Angular, Stripe](https://youtu.be/Kbauf9IgsC4)

## License

MIT License

© 2023 [Samson Rerri], Some rights reserved.
