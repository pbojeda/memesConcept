export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Your privacy is important to us.</p>
                <h2>1. Data Collection</h2>
                <p>We collect information necessary to process your order (name, address, payment info).</p>
                <h2>2. Analytics</h2>
                <p>We use tools like PostHog to understand how our website is used. This data is anonymized where possible.</p>
                <h2>3. Third Parties</h2>
                <p>We use Stripe for payments. We do not store your credit card information.</p>
            </div>
        </div>
    );
}
