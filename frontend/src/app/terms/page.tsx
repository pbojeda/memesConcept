export default function TermsPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to memesConcept. By using our website, you agree to these terms.</p>
                <h2>1. Purchases</h2>
                <p>All purchases are final. We do not offer refunds unless the item is defective.</p>
                <h2>2. Content</h2>
                <p>All memes are for entertainment purposes only.</p>
                <h2>3. Shipping</h2>
                <p>We ship to selected countries. Shipping times may vary.</p>
                <h2>4. Contact</h2>
                <p>If you have questions, please contact us.</p>
            </div>
        </div>
    );
}
