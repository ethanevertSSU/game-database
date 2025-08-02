# game-database

UPDATE 8/1: This website is no longer working with Google SSO since the access token is expired

## Best Practices
1. **NEVER directly edit main, no matter what**
2. **ALWAYS create a different branch when working on a task (I use [name]/[branch name] for a naming scheme**\
   -ex) ethan/loginbackend
3. **ALWAYS create a pull request so that we can review your code before sending it to production**\

If you are not sure 100% about something, don't be afraid to ask questions in the discord
-

### Project Dependencies

-[npm](https://npmjs.com/) (package manager)\
-[React.js](https://react.dev/) (Frontend Web Framework)\
-[Next.js](https://nextjs.org/) (Backend Web Framework and Router)\
-[Vercel](https://vercel.com/) (Web App Deployer)\
-[Prisma](https://prisma.io/) (DB Communication)\
-[Tailwind CSS](https://tailwindcss.com/) (CSS Framework)

### Possible Dependencies (Research More)

-[Prettier](https://prettier.io) (code formatting)\
-[Auth0](https://auth0.com/) (authentication suite)\
-[github actions](https://docs.github.com/en/actions) (handling tests before)

### Useful Tools
-[Postman](https://postman.com) (testing api calls)\
-[ChatGPT](https://chatgpt.com) (try not to use as a crutch)\
-[Figma](https://figma.com) (for ui design, no code)


### Initial Setup

1. [Download node.js](https://nodejs.org/en/download)
2. [Download git](https://git-scm.com/downloads)
3. Clone repo ([Directions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository))
4. [Download npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
5. run the following in ORDER!!\
   -``` npm install ``` (To install all dependencies)\
   -``` npm run db:generate ``` (To generate the prisma client)\ 
   -```cp .env.example .env``` (To create the environment file)
6. populate the .env file with the environment variables from vercel

### Useful Commands

#### npm commands
1. ```npm run dev``` (starts the development server so you can track your changes in (pretty much) real time)
2. ```npm run clean``` (deletes all node modules in your local environment, useful for troubleshooting local setup issues)
3. ```npm install [library]``` (installs library with given library name)

#### database commands
5. ```npm run db:migrate:createonly``` (creates a file that shows you the raw sql before you make changes to the database)
6. ```npm run db:migrage:dev``` (changes the db ONLY in the dev environment)
7. ```npm run db:viewer``` (to visually look at the data in the database)
8. 

#### github commands
7. ```git pull``` (pulls latests changes to the branch you are currently on)
8. ```git status``` (shows what files have been changed that ARE NOT commited yet)
9. ```git branch [Branch Name]``` (creates a branch with the name you gave it)
10. ```git checkout [Branch Name]``` (moves you into the branch with given branch name)
11. ```git add [File Name]``` (adds file/file changes to upcoming commit)
12. ```git add .``` (adds all changed files to upcoming commit)
13. ```git commit -m "[commit message]"``` (initializes commit with given message)
14. ```git push``` (pushes changes up to github, longer command will be given for first push for that specific branch)


