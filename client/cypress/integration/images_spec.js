/// <reference types="cypress" />

describe('images', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it('user can upload multiple images', () => {
    cy.task('db:teardown');

    // Register
    cy.visit('http://localhost:3000/register');
    cy.findByPlaceholderText(/username/i).type('Test user');
    cy.get('[data-test-id="password"]').type('123456');
    cy.findByPlaceholderText(/confirm password/i).type('123456');
    cy.findByRole('button', { name: /sign up/i }).click();

    const filePaths = ['images/cat.jpg', 'images/dog.jpg', 'images/nature.jpg'];
    cy.get('input[type="file"]').attachFile(filePaths);

    cy.contains('Completed uploading 3 / 3 images').should('exist');
    cy.contains('cat.jpg').should('exist');
    cy.contains('dog.jpg').should('exist');
    cy.contains('nature.jpg').should('exist');

    cy.wait(2000);
  });

  it('user can see images when going to the home page', () => {
    cy.visit('http://localhost:3000');
    cy.findByRole('img', { name: /cat\.jpg/i }).should('exist');
    cy.findByRole('img', { name: /dog\.jpg/i }).should('exist');
    cy.findByRole('img', { name: /nature\.jpg/i }).should('exist');

    cy.wait(2000);
  });

  it('user can search for images using filename and label', () => {
    cy.visit('http://localhost:3000');

    // Search for 'cat'
    cy.findByPlaceholderText(/username, filename/i).type('cat');
    cy.findByRole('button', { name: /search/i }).click();
    cy.findByRole('img', { name: /cat\.jpg/i }).should('exist');
    cy.findByRole('img', { name: /dog\.jpg/i }).should('not.exist');
    cy.findByRole('img', { name: /nature\.jpg/i }).should('not.exist');
    cy.findByPlaceholderText(/username, filename/i).clear();

    cy.wait(2000);

    // Search using labels
    cy.findByPlaceholderText(/labels/i).type('nature');
    cy.findByRole('button', { name: /search/i }).click();
    cy.findByRole('img', { name: /cat\.jpg/i }).should('not.exist');
    cy.findByRole('img', { name: /dog\.jpg/i }).should('not.exist');
    cy.findByRole('img', { name: /nature\.jpg/i }).should('exist');

    cy.wait(2000);
  });

  it('user can delete multiple images', () => {
    cy.visit('http://localhost:3000');

    // Checkmark some images
    cy.get('[data-test-id="cat.jpg"]').click();
    cy.get('[data-test-id="dog.jpg"]').click();
    cy.contains('Delete 2 images').click();
    cy.wait(2000);
  });

  it('user can delete all images', () => {
    cy.visit('http://localhost:3000');

    // Checkmark some images
    cy.contains('Delete ALL of my images').click();
    cy.wait(2000);
  });

  // it.only('nothing', () => {});
});
