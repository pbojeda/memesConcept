# Empresa
Empresa que detecta tendencias de memes en redes sociales u otras fuentes, utiliza o genera un meme basado en la tendencia que ha detectado, lo serigrafía en distintos tipos de productos (camisetas, tazas, sudaderas, cojines, carcasas de móvil, cromos) y los vende online.

# Flujo de interacción más frecuente por parte del usuario
1. Se entera de uno de nuestros productos a través de redes sociales, publicidad, emailing u otros.
2. Llega a la página del producto
3. Realiza la compra.
4. ve página de compra correcta con detalles de la compra
5. Recibe email de pedido

# Objetivos principales de este proyecto
- Validar que la gente tiene interés en comprar camisetas con memes a través de la web.
- Tener una página de producto integrada con stripe dónde los usuarios puedan introducir sus datos y realizar la compra


# Componentes principales
## Aplicación frontend web para usuarios
Una web donde los usuarios podrán acceder a una a la página de un producto, en la que podrán ver una o varias imágenes, una descripción, un precio y realizar la compra.  


## Aplicación backend
Una API Rest que ofrece endpoints al frontend.
Se pretende utilizar el widget/framework de stripe para agilizar el MVP, pero si es necesario el backend también se integra con stripe para la gestión de pagos.
En un futuro puede que también se integre con algún SaaS como Printful para la gestión de stock, productos y envios.

## Base de datos
Almacenamiento persistente de los datos de la aplicación. Una buena opción y gratuita puede ser mongodb atlas

# Requisitos funcionales
## Usuarios target
- deben poder ver el detalle de un producto
- deben poder comprar un producto
- deben ver que han comprado un producto correctamente, así como su número de pedido y los detalles de la compra
- deben recibir un email de confirmación de compra, esto tal vez lo hace stripe directamente.
- deben poder contactar con el equipo de ventas (usuarios gestores) a través de un formulario de contacto.

## Generales
- el sistema debe integrarse con stripe, que será la pasarela de pago
- tras una venta, el sistema debe enviar un email de confirmación con los detalles de la venta (esto tal vez lo hace stripe directamente)

# Requisitos no funcionales
- debe tener un diseño responsive
- debe prestar atención al posicionamiento SEO
- debe tener tiempos de carga lo más cortos posible
- debe permitir elegir talla y color del producto si hubiera varios disponibles

# UI/UX
- Responsive
- sencilla
- para el usuario target debe estar orientada a la venta de producto
- para el usuario gestor/administrador debe ser funcional

# Tecnologías
- Node.js y express para la API Rest Backend
- generación de imágenes Docker
- control de versiones con git
- Jest para test unitarios
- Cypress o Playwright para test end 2 end
- OpenApi para la especificación de la API Rest
- Frontend pendiente de decidir

# CI/CD
- GitHub Actions

# Deployment
- Docker
- Backend: estudiar alternativas, pero render parece una buena opción
- Frontend: estudiar alternativas, pero vercel o render parece una buena opción
- Base de datos: estudiar alternativas, pero mongodb atlas parece una buena opción

# Próximos pasos
1. Pregúntame todas las dudas que estimes oportunas
2. Analizar posibilidades de tecnologías para el frontend para un MVP lo más rápido posible
3. Ayúdame a configurar las reglas para tí, para que tu funcionamiento sea el mejor posible. Yo tengo una primera versión en *GEMINI.md* que es un enlace simbólico a "base-standards.mdc". También tengo uno de backend-standards.mdc para que se utilice en la elaboración de planes de implementación de backend o en la propia implementación. También tengo uno para frontend (frontend-standards.mdc) pero ese hay que configurarlo correctamente en función de la tecnología que utilicemos. También puedes ayudarme a configurar comandos, agentes, skills o hooks que consideres oportuno.
4. Elaborar un plan de desarrollo
5. Generar un fichero README.md del proyecto 
6. Realizar un MVP de forma rápida y robusta

---
A pesar de que te haya puesto unos próximos pasos, puedes aconsejarme cambiarlos de orden o añadir nuevos pasos si lo estimas oportuno.

---
# IMPORTANTE
Me gustaría seguir la metodología de desarrollo spec driven development, es decir, desarrollo basado en specs. 