const apiUrl = 'http://localhost:90/api';

describe('Graph edition and creation', () => {
  it('Creates a graph', () => {
    cy.visit('/builder');
    cy.wait(1000);
    // fill in the form
    cy.get('mat-label.ng-tns-c28-2').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('testGraph');
    cy.intercept('POST', `${apiUrl}/user/1/graphs`).as('createGraph');
    cy.intercept('GET', `${apiUrl}/user/1/graphs/*`).as('getGraphs');
    cy.get('form.ng-untouched > .mdc-button ').click();
    cy.wait('@createGraph');
    cy.wait('@getGraphs');
    cy.get('.reference-card__name').click();
    cy.get('.reference-card__name').should('have.text', 'START');
    cy.get('.menu-node--if > .node-container').should('be.visible');
    cy.get('.node-container__label > p').should('have.text', 'Example Custom Node');
    cy.get('.execution-button-container').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  it('Edits graph', () => {
    cy.intercept('GET', `${apiUrl}/user/1/graphs/64`, { fixture: 'edit-graph.json' }).as('getGraphs');
    cy.visit('/builder;id=64');
    cy.wait('@getGraphs');
    //assert that the graph is loaded
    cy.get(
      '#\\30 5921281-60e3-4d1d-a72b-c72d58a97a48 > .mat-badge > .node-container__info > .mat-mdc-card > .reference-card__name'
    ).should('have.text', 'START');
    cy.get(
      '#\\34 65f1fae-e25e-4e4e-a55f-5463e688ebae > .mat-badge > .node-container__info > .mat-mdc-card > .reference-card__name'
    ).should('have.text', 'IF node 1');
    //edit start node
    cy.get(
      '#\\30 5921281-60e3-4d1d-a72b-c72d58a97a48 > .mat-badge > .node-container__controls > .edit-button > .mat-mdc-button-touch-target'
    ).click();
    cy.get('svg.ng-tns-c29-8 > .ng-tns-c29-8').click();
    cy.get('#mat-option-0').click();
    cy.get('svg.ng-tns-c29-10').click();
    cy.get('#mat-option-7').click();
    cy.get('.save-button > .mdc-button__label').click();
    //edit post node
    cy.get(
      '#\\32 75d847c-2171-4b04-898e-0deb24976f77 > .mat-badge > .node-container__controls > .edit-button > .mat-mdc-button-touch-target'
    ).click();
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('POST node 5');
    cy.get('mat-label.ng-tns-c28-15').click();
    cy.get('#mat-input-2').clear('h');
    cy.get('#mat-input-2').type('h');
    cy.get('svg.ng-tns-c29-19').click();
    cy.get('#mat-option-31 > .mdc-list-item__primary-text').click();
    cy.get('#mat-mdc-form-field-label-14 > .ng-tns-c28-25').click();
    cy.get('#mat-input-4').clear('to');
    cy.get('#mat-input-4').type('token');
    cy.get('#mat-input-2').clear('ht');
    cy.get('#mat-input-2').type('http://test');
    cy.get('.save-button > .mdc-button__label').click();

    cy.intercept('PUT', `${apiUrl}/user/1/graphs/*`).as('updateGraph');

    cy.get('.save > .mdc-button__label').click();

    cy.wait('@updateGraph').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.request.body).to.deep.equal({"id":64,"name":"test-edit-graph","nodes":[{"expression":null,"id":"05921281-60e3-4d1d-a72b-c72d58a97a48","name":"","type":"TRIGGER","position":{"positionX":444,"positionY":49,"positionZ":0},"neighbours":["6ed43838-beef-410e-9392-3424f9d009fc","465f1fae-e25e-4e4e-a55f-5463e688ebae"],"schedule":"0 1 * * *"},{"expression":{"comparisonType":"Equal","compareTo":"valueFromNode","firstFieldValue":"","firstFieldNodeId":"","secondFieldUserValue":"","secondFieldNodeValue":"","secondFieldNodeId":""},"id":"465f1fae-e25e-4e4e-a55f-5463e688ebae","name":"IF node 1","type":"IF","position":{"positionX":398,"positionY":203,"positionZ":0},"neighbours":["8c558816-02ba-4be9-b9eb-610b3ab369dc"]},{"expression":{"comparisonType":"Equal","compareTo":"valueFromNode","firstFieldValue":"","firstFieldNodeId":"","secondFieldUserValue":"","secondFieldNodeValue":"","secondFieldNodeId":""},"id":"6ed43838-beef-410e-9392-3424f9d009fc","name":"IF node 2","type":"IF","position":{"positionX":657,"positionY":134,"positionZ":0},"neighbours":["7c9d9755-3289-4b10-9642-d1fc14122410"]},{"expression":{"comparisonType":"Equal","compareTo":"valueFromNode","firstFieldValue":"","firstFieldNodeId":"","secondFieldUserValue":"","secondFieldNodeValue":"","secondFieldNodeId":""},"id":"8c558816-02ba-4be9-b9eb-610b3ab369dc","name":"FILTER node 3","type":"FILTER","position":{"positionX":177,"positionY":248,"positionZ":0},"neighbours":["275d847c-2171-4b04-898e-0deb24976f77"]},{"request":{"method":"POST","body":"{}","url":"http://test","auth":{"type":"BEARER","token":"token"}},"arguments":[],"id":"275d847c-2171-4b04-898e-0deb24976f77","name":"POST node 5","type":"POST","position":{"positionX":110,"positionY":88,"positionZ":0},"neighbours":[]},{"request":{"id":16,"body":"{}","url":"","method":"GET","auth":{"token":"","type":"NONE"}},"arguments":[],"id":"7c9d9755-3289-4b10-9642-d1fc14122410","name":"GET node 1","type":"GET","position":{"positionX":414,"positionY":370,"positionZ":0},"neighbours":[]}],"isActive":false,"isDraft":false});
    });
  });
});
