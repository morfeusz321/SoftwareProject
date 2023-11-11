# Design discussion

To be discussed:

- [x]  GUI
- [x]  Representation of the graph (nodes/ edges)
- [x]  How do we store the graph in db - json
- [x]  Database schema
- [x]  Authentication
- [x]  “Interface” - list of flow charts
- [x]  Research that we want to do
- [x]  CI/CD

TODO:

1. Research:
    1. Usability of the graph
    2. How to store graph (and why json with coordinates)
    3. Safely storage of confidential data
2. GUI - similar to what insocial has

## Notes

- Graph storage: json. Store the entire graph together, not separate edges and nodes, that’s too complicated ( in project plan write why).
- UI: Insocial UI style menu bar on the left, space to choose an existing graph or create a new one. When in edit mode we can drag and drop to create a new kind of node (e.g. a GET or POST node or an Email node, treminal node, condition nodes, filter node). When we click on a node we can edit its fields, e.g. the endpoint and body.
- CI/CD: Tests/ Checkstyle/ Build and deployment/(maybe check for Transloco for locale?)
- We connect to Insocial authentication, and just need to set up API to get a token.
- For project plan research: consider how we store credentials. E.g. we create a node which GETs from Visma, and we need to provide an id+secret to access Visma’s API. Encrypted in the database probably, not hashed because then how do you pass along the secrets for the required requests.
- Might want autosave: every some time send the whole graph (?).
- Could: take into account that the authentication a user provides in a flow will expire, so we can have some thing to notify the user when the auth in one of their flows is going to expire.

### Branch conventions

- At least two approvals to merge

~~- Naming conventions:~~
- ~~FE-#~~
- ~~BE-#~~

### Tickets:

- feat:
- fix:
- chore:

2 approvals

no pushing to main directly