# Northcoders News API. 

## Summary
This is a project featuring a simplified database (db) for a social media/forum database where we simulate how registered users can create or comment articles. Each article can be commented on in a one to many relationship. 
Only a registered user (a user exist in the users table) can create a new comment. However anyone can add upvote or downvote the associated article or the comment associated.  
This project includes an api that allow users to enquiry all existing users / articles / topics / comments and updates or delete the associated comments. 

![nc_backendproject_datarelationship drawio](https://github.com/cls-c/nc-news/assets/24395930/0f56f24d-831b-4b30-8722-6ee08405ca81)
This diagram illustrated the table field relationship. 


### Try it out yourself - Currently hosted on Render : https://clsc-nc-news.onrender.com/api 
Use /api endpoint to check all available endpoints, accepted query, payload format and example responses...etc



## To initiate and test this project
You can clone the project using ```git pull origin https://github.com/cls-c/nc-news.git```

Use `npm install` to install all required packages. 
Minimum app version: 
postgres : ^8.7.3
Node : v21.2.0 or above

Create the developement & testing envinroment for database connection: create a .env.developement file, into each, add PGDATABASE=nc_news and PGDATABASE=nc_news_test respectively

After you created the environment details, you can create the local db with `npm run setup-dbs` and seed the local database with  `npm run seed`

Currently existing tests are all written in jest and supertest. You can also run test with the pre-written script: `npm run test` 


