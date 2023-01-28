# Recipe API

My API implementation to support the Trial Project described in this [link](https://docs.google.com/document/u/3/d/e/2PACX-1vQs3edJW8_XYeswcGlwOhsUWFEcEg2wrKIY5m3Yj8Q7ienKs6BkFzXVuMD6yTs9jxmY46wvCnbK23yu/pub?urp=gmail_link).

The entire API runs on Node.js and is fully written in TypeScript.

It utilizes MongoDB for fetching and storing of data, which is being ran in docker. (see `docker-compose.yml`)

It follows the [Route-Controller-Service structure for ExpressJS](https://devtut.github.io/nodejs/route-controller-service-structure-for-expressjs.html).

Node version used: v16.19.0.

## Setup Database

    docker compose up -d

## Install Dependencies

    npm install
    
## Run the tests (make sure database is up)

    npm test

## Build App

    npm run build

## Run App (ts-node)
    
    npm run dev

## Seed First Admin

    npm run seed:admin

# API

The API endpoints' request and response are described below. Though I highly suggest to check the test cases `./test` as it already serves as a good documentation.

## Registration

### Request

`POST /register`

    localhost:3000/register

    {
        "email": "test@gmail.com",
        "password": "password"
    }

### Response

    201

    {
        "message": "Account successfully created."    
    }

## Login

### Request

`POST /login`

    localhost:3000/login

    {
        "email": "test@gmail.com",
        "password": "password"
    }

### Response

    200

    {
        "message": "Login successful."   
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxNmU3NzU4LWU1YTYtNDFlNy1iYmM2LTMzNWI1NTgyZTI0YyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY3NDg3MTI0OSwiZXhwIjoxNjc0ODcxODQ5fQ.LbcqSk6bOT8TTGgiobLG9TW_KLkwv-f9ospclanAScQ" 
    }

## Creating User

### Request

`POST /users/add`

    localhost:3000/users/add

    "authorization": "Bearer token..."

    {
        "email": "test@gmail.com",
        "password": "password",
        "role: "ADMIN"
    }

### Response

    201

    {
        "message": "User successfully created."    
    }

## Listing Users

### Request

`GET /users`

    localhost:3000/users

    "authorization": "Bearer token..."

### Response

    200

    {
        "users": [
            "id": "1..."
            "email": "test@gmail.com"
            "password": "hashed..."
            "role": "ADMIN"
        ]    
    }

## Updating User

### Request

`PUT /users/update/:id`

    localhost:3000/users/update/1...

    "authorization": "Bearer token..."

    {
        "email": "testupdated@gmail.com",
    }

### Response

    200

    {
        "message": "User successfully updated."    
    }

## Deleting User

### Request

`DELETE /users/delete/:id`

    localhost:3000/users/update/1...

    "authorization": "Bearer token..."

### Response

    200

    {
        "message": "User successfully deleted."    
    }
    
## Creating Recipe

### Request

`POST /recipes/add`

    localhost:3000/recipes/add

    "authorization": "Bearer token..."

    {
        "name": "name1",
        "ingredients": "ingredients1",
        "instructions: "instructions1"
    }

### Response

    201

    {
        "message": "Recipe successfully created."    
    }

## Listing Recipes

### Request

`GET /recipes`

    localhost:3000/recipes

    "authorization": "Bearer token..."

### Response

    200

    {
        "recipes": [
            "id": "1..."
            "name": "name1",
            "ingredients": "ingredients1",
            "instructions: "instructions1",
            "createdBy": "1..."
        ]    
    }

## Updating Recipe

### Request

`PUT /recipes/update/:id`

    localhost:3000/recipes/update/1...

    "authorization": "Bearer token..."

    {
        "name": "updatedname",
    }

### Response

    200

    {
        "message": "Recipe successfully updated."    
    }

## Deleting Recipe

### Request

`DELETE /recipes/delete/:id`

    localhost:3000/users/recipe/1...

    "authorization": "Bearer token..."

### Response

    200

    {
        "message": "Recipe successfully deleted."    
    }





