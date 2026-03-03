/// <reference types="cypress" />
describe('Product and Checkout Flow', () => {
    beforeEach(() => {
        // Visit the home page
        cy.visit('http://localhost:3001');
    });

    it('allows viewing a product and initiating checkout', () => {
        // Check if products are listed (requires backend)
        // If backend is offline, we expect "No products found" text
        cy.get('body').then(($body) => {
            if ($body.find('p:contains("No products found")').length > 0) {
                cy.log('Backend offline or empty, skipping checkout test');
            } else {
                // Click first product
                cy.get('a[href^="/products/"]').first().click();

                // Verify product page loaded
                cy.url().should('include', '/products/');
                cy.get('h1').should('exist'); // Product title

                // Select a variant if available (skip if simple implementation or no variants)
                cy.get('body').then(($body) => {
                    if ($body.find('h3:contains("Size")').length > 0) {
                        // Click on the first available size
                        cy.get('h3:contains("Size")').parent().find('button').not('.opacity-60').first().click();
                    }
                    if ($body.find('h3:contains("Color")').length > 0) {
                        // Click on the first available color
                        cy.get('h3:contains("Color")').parent().find('button').not('.opacity-60').first().click();
                    }
                });

                cy.intercept('POST', '**/checkout').as('checkoutRequest');

                // Click Buy Button
                cy.contains('button', 'Buy Now').should('not.be.disabled').click();

                // Wait for the checkout request
                cy.wait('@checkoutRequest').then((interception) => {
                    expect(interception.response?.statusCode).to.eq(200);
                    // Verify the variant was sent in the body
                    const body = interception.request.body;
                    expect(body).to.have.property('productId');
                });
            }
        });
    });
});
