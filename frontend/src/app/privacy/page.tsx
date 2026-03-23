export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
            <div className="prose max-w-none text-gray-700">
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
                <p>En memesConcept, tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información personal.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Recopilación de Datos</h2>
                <p>Recopilamos la información estrictamente necesaria para procesar y enviar tu pedido. Esto incluye tu nombre, dirección de envío, y dirección de correo electrónico.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Pagos y Stripe</h2>
                <p>Nuestros pagos son procesados de forma segura a través de <strong>Stripe</strong>. No almacenamos, retenemos ni tenemos acceso a la información de tu tarjeta de crédito en nuestros propios servidores. Stripe maneja tu información financiera bajo sus propias y rigurosas políticas de seguridad.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Analítica Web</h2>
                <p>Utilizamos herramientas como PostHog para entender cómo los usuarios navegan en nuestro sitio de forma agregada. Estos datos se anonimizan cuando es posible y nos ayudan a mejorar la experiencia de usuario general sin rastrear identidades individuales más allá de lo necesario para brindar el servicio.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Divulgación a Terceros</h2>
                <p>Aparte del procesador de pagos y los servicios de análisis mencionados, no vendemos, intercambiamos ni transferimos tus datos a terceros con fines comerciales o de marketing sin tu consentimiento previo.</p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p>Si tienes cualquier duda sobre cómo tratamos tus datos, puedes contactarnos a: <a href="mailto:contact@memesconcept.com" className="text-black font-semibold hover:underline">contact@memesconcept.com</a></p>
                </div>
            </div>
        </div>
    );
}
