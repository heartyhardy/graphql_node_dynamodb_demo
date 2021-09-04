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

## Day 3

- Added few more resolvers
- gameByID and gameByGenre functions added and mapped to the resolvers
- All resolvers are now Async
- Added better comments

## Day 4-5
- Changed the database design. Genre is now the partition key and title is the sort key
- Made changes to the DynamoDB data fetching functions
- Added a complex query to filter titles by game rating (upper and lower bounds)
- Added a GrapQL resolver to execute about query
