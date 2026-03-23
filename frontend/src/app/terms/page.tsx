export default function TermsPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
            <div className="prose max-w-none text-gray-700">
                <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>
                <p>Bienvenido a memesConcept. Al acceder y utilizar nuestro sitio web, aceptas quedar sujeto a los siguientes términos de servicio. Por favor, léelos con detenimiento.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">1. Compras y Pedidos</h2>
                <p>Todas las compras realizadas a través de nuestra web están sujetas a la disponibilidad del producto. Nos reservamos el derecho a cancelar cualquier pedido por razones imprevistas, en cuyo caso reembolsaremos el monto total.</p>
                
                <h2 className="text-xl font-semibold mt-8 mb-4">2. Devoluciones y Reembolsos</h2>
                <p>Nuestros productos son fabricados bajo demanda ("print-on-demand"). Por ello, <strong>no aceptamos devoluciones por cambios de talla, color o arrepentimiento</strong>. Únicamente procesaremos reembolsos o reemplazos si el artículo recibido es defectuoso o si se ha cometido un error objetivo en el diseño respecto a lo mostrado en la web. Tienes un plazo de 14 días desde la recepción para reportar el problema.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">3. Envíos</h2>
                <p>Realizamos envíos a los países listados durante el proceso de pago. Los tiempos de envío son estimaciones proporcionadas por nuestros socios logísticos y pueden variar según la localización y condiciones externas. No nos hacemos responsables de los retrasos aduaneros.</p>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. Propiedad Intelectual</h2>
                <p>El concepto de "memesConcept" es ofrecer diseños paródicos. No reclamamos propiedad sobre los chistes de internet, pero sí protegemos las adaptaciones gráficas originales realizadas y distribuidas en nuestra tienda.</p>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p>Si tienes dudas sobre estos términos, escríbenos a: <a href="mailto:contact@memesconcept.com" className="text-black font-semibold hover:underline">contact@memesconcept.com</a></p>
                </div>
            </div>
        </div>
    );
}
