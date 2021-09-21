/// <reference types="cypress" />

describe('register and login', () => {
  beforeEach(() => {
    cy.task('db:teardown');
  });
  it('user can register and login', () => {
    // Register
    cy.visit('http://localhost:3000/register');
    cy.findByPlaceholderText(/username/i).type('Test user');
    cy.get('[data-test-id="password"]').type('123456');
    cy.findByPlaceholderText(/confirm password/i).type('123456');
    cy.findByRole('button', { name: /sign up/i }).click();

    cy.wait(1000);

    // Logout
    cy.contains('Logout').click();

    cy.wait(1000);

    // Login
    cy.contains('Login').click();
    cy.findByPlaceholderText(/username/i).type('Test user');
    cy.findByPlaceholderText(/password/i).type('123456');
    cy.findByRole('button', { name: /login/i }).click();
  });
});
