# Northcoders News API. 

## Summary
This is a project featuring a simplified database (db) for a social media/forum database where we simulate how registered users can create or comment articles. Each article can be commented on in a one to many relationship. 
Only a registered user (a user exist in the users table) can create a new comment. However anyone can add upvote or downvote the associated article or the comment associated.  
This project includes an api that allow users to enquiry all existing users / articles / topics / comments and updates or delete the associated comments. 

### Try it out yourself - Currently hosted on Render : https://clsc-nc-news.onrender.com/ {endpoint}
Use /api endpoint to check all available endpoints, accepted query, payload format and example responses...etc


## To initiate this project
You can clone the project and create a new repo in your personal repo. Then in your terminal, push your code to your own repository with the following command: 
```
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
``` 

Use `npm install` to install all required packages. 

Create the developement & testing envinroment for database connection: create a .env.developement file, into each, add PGDATABASE=nc_news and PGDATABASE=nc_news_test respectively

After you created the environment details, you can created the local db with `npm run setup-dbs` and seed the local database with  `npm run seed`

Currently existing tests are all written in jest and supertest. You can also run test with the pre-written script: `npm run test` 


If you wish to host the project on yourself: 
You can host the db with the free tier ElephantSQL and create your own production enviornment. 
