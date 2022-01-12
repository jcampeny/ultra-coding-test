<p align="center">
  <a href="https://ultra.io/">
    <img src="https://ultra.io/logotype-icon.png" width="150px" height="150px"/>
  </a>
</p>
<h1 align="center">
    🎮️ Ultra Coding Test
</h1>

<p align="center">
    This is a coding exercise that consist in implementing a little backend micro-service which aims to serve games data.
</p>

## 🛠️ Running the app
To download the necessary docker images, build dependencies and start the application you should execute:
```bash
$ docker-compose up
```
The application is running now on: http://localhost:3000/ .</br></br>
_In order to run tests in your local machine you should execute`npm install`_

## 🐳 Access Docker containers
Get the container id that you want to access:
```bash
$ docker ps
```
And then access to the container:
```bash
$ docker exec -it CONTAINER_ID /bin/sh
```

## 🗄️ Run queries to MySQL 
Inside the MySQL docker container execute:
```bash
# Access to MySQL client as a root
$ mysql -u root -p
# You can find the root password in .env file
# Use the project's database
$ USE ultra-gaming;
```

## 🧪 Test
To develop or run the unit tests faster install the dependencies in your machine and execute:
```bash
$ npm run test
 # PASS  src/app.controller.spec.ts (4.271 s)
 # PASS  src/games/games.controller.spec.ts (4.865 s)
 # PASS  src/games/games.service.spec.ts (5.552 s)
```

To run the e2e tests you should access to the NodeJS Docker container and run:
```bash
$ npm run test:e2e
 # PASS  test/app.e2e-spec.ts (5.571 s)
 # PASS  test/games.e2e-spec.ts (5.748 s)
```

# 🤔 Project questions and answers
In this section I wanted to add some questions that came to my mind during the development of this test, and I wanted to keep it documented:

**🙋 Why is everything coupled to the Framework?**
> I love to learn new things, and this is one of these opportunities to code with something unfamiliar, NestJS. It was my first contact with it, so I pretended to do the things in the way the framework recommended.

**🙋 On what have you based your decisions to follow good practices?**
> I tried to follow as much as possible the examples in the documentation, in addition to the NestJS good practices repository: https://github.com/nestjs/nest/tree/master/sample

**🙋 And this has led you to have anemic entities that are not very friendly to OOP principles...**
> Exactly, I would like to encapsulate the properties, following principles like "Tell, don't ask", among others. But this can sometimes be a worthwhile tradeoff that is agreed with the team, because it is not necessary to be radical with every software concept in the industry. 

**🙋 Why aren't you testing the integration with database?**
> This is something that I would have liked to do in order to make the application's tests more reliables. I didn't do it because I've no more time to implement the database seeds, independent test database transactions, etc.
> Another great improvement would be to add Gherkin e2e tests, with cucumber, for example.

**🙋 Do you documented the endpoints with OpenAPI?**
> No, this would be great, and I find that NestJS has the SwaggerModule, that makes its integration very fast just by adding it to the module file.

**🙋 How would you have done it without the NestJS architecture proposal in its documentation?**
> I've really enjoy coding with clean architectures such as Hexagonal, DDD and TDD. So in short, I would have moved all the application logic to the entities, which would be decoupled from the infrastructure layer at the domain layer, along with the repository interfaces. The services would be in the application layer, for the purpose of orchestrating the entities and repositories. The infrastructure layer would have the controllers and the concrete implementations of the repositories. The unit tests will check the services of the application layer, which would not be necessary to raise the framework to execute them, with this we would cover the logic of the entities too. The integration tests would cover the concrete implementations of the repositories. And the 2e2 tests would check the behavior of the controller, all the domain logic and the database connections. 
