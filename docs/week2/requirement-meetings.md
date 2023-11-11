# Requirements questions

### General meeting questions:

- ~~Adding guests to Postman collection~~
- ~~contracts~~
- ~~weekly / bi-weekly meetings about the progress~~

### Requirements questions:

1.  ~~How should the design look like, should we use Insocial color scheme along with some designs for components as buttons etc~~
2. ~~Should we include dutch translations?~~
3. ~~How should authentication work? do we integrate it with our backend?~~
4. ~~What other security measures should we implement?~~
5. ~~Which functionalities of Insocial API should we include (invites, surveys) (create a list)~~
6. ~~Does it have to support for various API connections (gmail whatsapp ?)~~
7. ~~How will it be integrated to Insocial products afterwards? (plugin, copy-paste with database migration?)~~
8. ~~Error handling (what happens when one of the request fails)?~~
9. ~~Ability to send test requests on selected graph node?~~
10. ~~Which Insocial functionalities will we use in our implementation (sending invites, reports, exporting responses, metadata)~~
11. ~~Execution schedule or execution once on send?~~
12. ~~What is the flow for the UI, create a new flow then redirect to dragging screen or something like that.~~
13. ~~In what form do we expect the data to be at the clients’ endpoints.~~
14. ~~What should be the format for providing endpoints? CSV? Node factory?~~ 
15. ~~User profile? Each user has access to his own control flows that are saved in database?~~ 
16. ~~What control ability do you want? If/ schedule - make a list~~
17. ~~Reusing nodes.~~

# Meeting notes

- 1000 per person
- Weekly meetings to discuss progress - friday at 13:00
- Postman - to discuss with jesse (how do you spell this)
- Design - we have freedom, but nice if we can use a consistent style
- Language - implement the functionality for a different language (json) but don’t do the actual translation
- What connections to support: make it just provide an endpoint, some auth, and some simple filtering
- Ability to send test requests (we don’t know what some node might return?): would be very nice; take a look at what messagebird does things, maybe tells you “flow stopped here because errors”
- Ability to specify triggers/conditions
- Concrete use cases / user flows / examples on the way, nice
- We DO want ability to have timed flows, for example in the morning at some time each day
- UI - we can design ourselves

### Jesse meeting notes

- authentication - we’ll come back one that. 

- microservices? “not sure if you would call it a microservice”

- “various api connections” - do we, for each node, have postman-style specification of all the details manually (like url, body etc) vs preset options - nice to have both, some hardcoded and then have the option to make a custom manual one. Jesse will give a list of the ones we should have hardcoded.

- integration with the Insocial product - should use the existing database, not really a microservice since it won’t have its own database; want MySQL to make integration easy afterwards.

- Insocial features like colour scheme, buttons - copy some components, colours, consult the brand book

- communication: no annemiek/jesse on slack, use whatsapp when we want to set up something

- postman: our own collection for 5 people; or just one account with shared credentials

- data format: json default, could have XML. when we have some request when we don’t know the format of the thing that will be returned, do we want to be able to do a test request to be able to check the format: yes, would be nice, probably a could have.

- most important ways of auth: JWT? Bearer? A: look at what Salesforce, AVAS, Visma are using, give those more priority.

- would be nice to support an excel export for responses, like as a drop item. basically one of the actions we are going to be able to perform. others: send survey statistics (amount of responses), todo: get document about the others.

- schedule: executing the flow the way the execute scheduled tasks (?), trigger by webhook? have both button for executing flow now and a schedule. then the button basically uses some endpoint, and the insocial API can trigger that one some schedule, so integration should be easy.

- what kinds of conditions: some hardcoded ones, what exactly? what are the things that we can put in an if? we want: time, something for integration with Insocial API, like number of responses. also we want to figure out what checks we should be able to do on data from a response, like checking the length of a returned list. todo: get list of these from jesse/annemiek.

- storing flows per user: store should be stored per customer level. we mock a customer table and use that, for easy integration later.

- security is not the most important part for our product, since the insocial product will do that after integration. maybe we hardcode an admin token, and use that when sending requests to Insocial. create environment, client, use auth token from the client (?)

- should have: also store individual endpoints, so they can be reused.

- storing the graph in a database: have each db entry be a json graph representation. serialised graph object.

- testing: do we aim for some coverage, or focus on having the core functionality well-tested. don’t let URLs drop tables…

- todo: send MoSCoW, get it approved

- pretty important: the list of conditions in the if, and list of hardcoded APIs (like sending a whatsapp/gmail mes

- want to be able to see where the flow fails when it fails. have a list of things flows that were ran, be able to see the ones that succeeded/failed, click on one to get details on where it failed

- GDPR: sensitive data from hubspot (?) not storing stuff, our store only metadata in Insocial application.
