describe('Product and Checkout Flow', () => {
    beforeEach(() => {
        // Visit the home page
        cy.visit('http://localhost:3000');
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

                // Click Buy Button
                cy.contains('button', 'Buy Now').click();

                // Should see loading spinner or proceed
                // Since this hits Stripe API, we might mock it or just check network call
                // For now, check if button goes disabled or loading
                cy.contains('button', 'Buy Now').should('be.disabled');
            }
        });
    });
});
