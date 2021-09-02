# A basic Apollo GraphQL server in NodeJS

## How to run

1. Clone the repo
2. Make sure [NodeJS](https://nodejs.org/en/download/) is installed in your machine.
3. In your terminal type ```npm install``` and press ENTER
4. After npm finishes installing, run ```npm start``` to launch the Apollo Sandbox

## Day 1
- Added a basic schema 
- Created a Mock Data source in JS
- Added a single resolver to fetch all games from the mock data

## Day 2

- Added AWS SDK for connectivity
- Created necessary functions to connect and scan for data in a single table 'Game'
- Replaced the default resolver in the Query to return actual data from DynamoDB

