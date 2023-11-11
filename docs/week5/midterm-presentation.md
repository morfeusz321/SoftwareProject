- introduction
    - who we are
    - what we'll be talking about
- what the problem we're tackling is
    - the flowbuilder
    - what and why
- requirements
    - why we needed to figure out requirements
    - how we did this
    - meetings with:
        - annemieke, product owner: perspective of the user
        - jesse, software developer: technical requirements
    - moscow
    - noteworthy requirements:
	    - (we'll spare you the boring details)
	    - functional flow graph execution, connecting client's APIs with insocial APIs
	    - usability for non-technical people
	    - integration with client's existing systems
- design
	- we created an initial prototype with figma
	- overview of current design
		- UI (builder/graph/node view)
		- what you can do in the builder
		- flow execution strategy
	- tools we used
		- some because of requirements with clients
		- Angular with TypeScript for front-end
			- MVC model
			- Angular Material UI components
			- Leader-line for graph edges
			- documentation package
		- Symfony with PHP for back-end
			- ORM database (MySQL)
			- endpoints and entities, controllers and services, much like in spring
			- documentation bundle
		- Docker
- development process
	- so how do we actually work productively to fullfil the requirements?
	- agile
		- sprints monday-friday
		- retrospectives
		- incremental improvement
	- software quality:
		- user stories
			- help us make it concrete what must be done
			- split into smaller issues with clear definitions of done, so we can efficiently work on different aspects of the project
		- code reviews
			- work on issues on separate branches, require 2 approvals
			- use comments to make improvements
		- static analysis (ESLint, PHPStan)
		- testing!
		- CI/CD pipeline to build our code and run tests
	- meetings and how we use them
		- weekly with TA
		- weekly with client
		- daily with team
		- weekly with team: task distribution, retrospective
- overview of progress
	- what we worked on in week
	- what we've implemented
		- A
		- B
		- C
	- demo!
- main things we still have to do
	- support request arguments (so a node can put data from previous nodes in the body of its request)
	- document the build process and dependencies of our project
	- usability tests
	- many should and could haves: error handling, testing flows, logging, saving of individual nodes, e-mail API node templates...
	- we feel confident that we can finish the must haves, probably around week 6, and we're optimistic that we can also do a lot of the should's and could's as well

intro:
	hi, we're project team 5D - the bug busters - and we'll be telling you today about the progress of our project: Flow Builder for API Integrations. what exactly will we go over?
- we'll start off with an analysis of the problem we're solving - what are we actually creating? why would it be useful? what are our requirements?
- next we'll talk about our design - the choices we've made, both in our interfaces and in the technologies chosen
- then we'll discuss our design process - how we do stay productive to actually fullfil our requirements?
- After that, we'll discuss what we've done each week until now, culminating with a demo of our product
- and we'll end with a discussion of what we still have to do
	 
	

software quality evaluation
well designed, frameworks
formualted requirements, on track with implementing
documentation quality (dependencies, build, APIs)

makes and executes the project plan??
initiative in meetings with client and TA
good teamwork with client / TA interactino
equal contributions
