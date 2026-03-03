/// <reference types="cypress" />

describe('Shopping Cart Flow', () => {
    beforeEach(() => {
        // Visit the home page
        cy.visit('http://localhost:3001');
        cy.window().then((win) => {
            win.localStorage.clear();
        });
        cy.reload();
    });

    it('allows adding products to the cart and managing them', () => {
        cy.get('body').then(($body) => {
            if ($body.find('p:contains("No products found")').length > 0) {
                cy.log('Backend offline or empty, skipping cart test');
            } else {
                // 1. Visit product page
                cy.get('a[href^="/products/"]').first().click();
                cy.url().should('include', '/products/');

                // Select variant
                if ($body.find('h3:contains("Size")').length > 0) {
                    cy.get('h3:contains("Size")').parent().find('button').not('.opacity-60').first().click();
                }
                if ($body.find('h3:contains("Color")').length > 0) {
                    cy.get('h3:contains("Color")').parent().find('button').not('.opacity-60').first().click();
                }

                // 2. Select quantity
                cy.get('[data-testid="quantity-selector-input"]').should('have.value', '1');
                cy.get('[data-testid="quantity-increase"]').click();
                cy.get('[data-testid="quantity-selector-input"]').should('have.value', '2');

                // 3. Add to cart
                cy.get('[data-testid="add-to-cart-button"]').click();

                // 4. Drawer should open
                cy.get('[data-testid="cart-drawer"]').should('be.visible');
                cy.get('[data-testid="cart-item"]').should('have.length', 1);

                // 5. Increase in cart
                cy.get('[data-testid="cart-item-increase"]').click();
                // The value should be updated (you can also assert visually)

                // 6. Checkout
                cy.intercept('POST', '**/checkout').as('checkout');
                cy.get('[data-testid="checkout-button"]').click();
                cy.wait('@checkout').then((interception) => {
                    expect(interception.response?.statusCode).to.eq(200);
                    expect(interception.request.body.items).to.have.length(1);
                });
            }
        });
    });
});
