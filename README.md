# E-Library | [frontend](https://library-ui.onrender.com)

The E-Library frontend is a single-page application built with React and TypeScript. Crafted with a focus on user-friendliness and intuitive design, it empowers clients and staff to effortlessly navigate and interact with the digital library. Additionally, it aims to enhance the efficiency of standard library procedures for both administrators and users.

## Table of Contents
- [User Interactions](#user-interactions)
- [Features](#features)
- [Technological Description](#technological-description)
- [Deployment](#deployment)

## User Interactions <a name="user-interactions"></a>
* **For Clients:**
     - Searching for books is possible without the need for logging in.
     - To reserve books and access your account, please register using Auth0.
* **For Administrators:**
     - Log in using the following credentials:
       > Email: manager@gmail.com \
       > Password: Qwert123

## Features <a name="features"></a>
* **Library Administration:**
   > Administrators can efficiently manage the library's resources with the following functionalities:
   - Adding new clients
   - Adding and updating books
   - Borrowing books and confirming returns
   - Checking the history of borrowed and reserved books
   - Confirming reservations made by clients
     
* **Library Client:**
   > Clients can easily perform the following operations:
   - Checking library resources by categories or phrases
   - Making and canceling reservations
   - Checking the history of reserved and borrowed books
   - Exploring new clubs and activities offered by the library
  
## Technological Description <a name="technological-description"></a>

### Language and Framework 
* TypeScript
* React

### Other Tools
* React Router
* Material-UI
* Auth0
* Redux Toolkit
* Axios

## Deployment <a name="deployment"></a>
* The frontend is hosted as a static site on the Render platform.
