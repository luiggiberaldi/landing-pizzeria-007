Pizzería 007 → Web Profesional
Este proyecto convierte el perfil de Instagram de Pizzería 007 en una web profesional
para negocio de restauración local en Valencia, Venezuela.

Comportamiento al iniciar
Cuando el usuario abra esta carpeta y escriba cualquier cosa, responde exactamente con:

Bienvenido al creador de web para Pizzería 007

Voy a construir una web profesional basada en el Instagram de la pizzería.
Ya tengo datos base del negocio. Voy a entrar al perfil, descargar las fotos reales
y luego te haré solo las preguntas que no pueda encontrar.

¿Arrancamos?

Después, usa la lógica definida en este archivo automáticamente.

Datos conocidos del negocio (NO inventar ni modificar sin confirmación)
```text
Nombre:         Pizzería 007
Instagram:      @pizzeria007 (120,000 seguidores)
Facebook:       https://www.facebook.com/p/pizzeria007-100083463875552/ (~1,000 seguidores)
Ubicación:      Valencia, Estado Carabobo, Venezuela
Nicho:          Restaurante / Pizzería local — gastronómico tradicional y popular (fundado en 1967)

Sedes confirmadas:
  Sede Norte:   Av. Monseñor Adams, Local 1 y 2 (al lado del Banco Provincial,
                frente a Farmatodo), El Viñedo, Valencia
  Sede Centro:  Calle Rondón (frente a la antigua parada universitaria,
                diagonal al antiguo Banco Exterior), El Centro, Valencia

Horario (Sede Norte):  Lunes a Sábado, 11:00 am – 5:00 pm
Horario (general):     Todos los días 10:00 am – 11:00 pm (varía feriados)
Teléfono Sede Norte:   0414-436.9559 / 0424-418.9796 / 0424-419.3921
WhatsApp Sede Centro:  0414-580.4172
Formas de pago:        Efectivo, Débito, Pago Móvil (a confirmar)
```

Oferta gastronómica confirmada:
  - +17 variedades de pizza (pequeña, mediana, familiar)
  - Pizza familiar 33cm desde ~$7.99 (promo arma tu pizza)
  - Pizza personal desde $2.99 – $3.50
  - Pasticho, pastas, hamburguesas, postres, helados
  - Horno a leña / hornos propios
  - Ingredientes frescos, masa artesanal
  - 1 ingrediente extra por $1 adicional aprox.

Salones / ambiente:
  - 3 salones temáticos: Nápoles, Roma y Venecia
  - Decoración italiana: cuadros, bombillas, mesas grupales e individuales
  - Muy concurrido de noche — recomendado llegar antes de las 9pm
  - Estacionamiento limitado (usar aceras/calle en hora pico)
  - Atención en mesa + servicio de delivery

Posicionamiento de marca:
  - Eslogan conocido: "Somos mucho más que una pizzería. SOMOS 007"
  - Referente gastronómico en Valencia — "las mejores pizzas de todo Valencia"
  - Precio accesible en dólares / euros (contexto venezolano)
  - Familiar, para parejas y grupos de amigos
  - Presencia fuerte en Instagram, TikTok y Facebook
Lo que Claude debe hacer automáticamente
Paso 1 — Extraer datos del Instagram
bash
node --version 2>/dev/null && echo "Node.js OK" || echo "NO_NODE"
Si Node.js está disponible: instalar Playwright e ir a https://www.instagram.com/pizzeria007/
para descargar:

Foto de perfil

Bio completa y descripción actual

Las últimas 12 fotos del feed (priorizando las de pizzas y platos)

Número de seguidores

Tick verificado (si lo tiene)

Hashtags frecuentes en los posts recientes

Si NO hay Node.js, decirle al usuario:

"Puedo trabajar igual sin acceder automáticamente al Instagram.
Te pido solo lo que no tengo. La web quedará igual de buena."

Paso 2 — Buscar presencia en otras redes
Buscar reseñas, fotos y menciones en:

TikTok: tiktok.com/discover/pizzeria-007-valencia

Google Maps: buscar "Pizzería 007 Valencia Venezuela"

Facebook: facebook.com/p/pizzeria007-100083463875552

Cualquier reseña o artículo público

Sumar seguidores totales entre plataformas si es posible.

Paso 3 — Preguntar SOLO lo que falte
No repetir preguntas sobre datos ya conocidos arriba.
Preguntar únicamente:

text
1. ¿Tienes números de WhatsApp completos para pedidos? (tenemos parciales)
2. ¿Hay promociones actuales o combos destacados esta semana?
3. ¿Cuáles son tus 5 pizzas más pedidas o favoritas del menú?
4. ¿Hacen delivery propio o usan apps (PedidosYa, etc.)?
5. ¿Tienes colores de marca definidos? (rojo, negro, blanco — propongo si no)
6. ¿Hay email de contacto o solo WhatsApp?
7. ¿Quieres incluir una sección de reservas o solo pedidos?
Paso 4 — Generar la web
Crear un único archivo HTML + carpeta assets/ con las fotos reales.

Estructura de la web a generar
Secciones obligatorias (en este orden)
text
1. NAV           — Logo 007 + links internos + botón "Pedir ahora" (sticky en móvil)
2. HERO          — Foto impactante de pizza + tagline + CTA principal
3. SEDES         — Mapa / dirección de las 2 sedes + horario + teléfonos
4. MENÚ          — Grid de pizzas destacadas con fotos reales + precios
5. GALERÍA       — Grid de fotos del Instagram (últimas 9-12)
6. NOSOTROS      — Historia / "Somos 007" + los 3 salones temáticos
7. COMBOS/PROMOS — Ofertas activas con precio y CTA
8. CONTACTO      — WhatsApp flotante + formulario básico + redes sociales
9. FOOTER        — Dirección, horario, redes, copyright
Componentes especiales
Botón WhatsApp flotante — siempre visible en móvil y desktop

Banner de delivery — si hacen delivery, mostrarlo como badge en el hero

Contador de platos o dato social proof (ej: "+10 años en Valencia", "17 variedades")

Instagram feed embed — últimas fotos directamente desde el perfil

Especificaciones de diseño
Paleta de colores (propuesta basada en identidad italiana + venezolana)
css
/* Propuesta A — Clásica italiana: rojo, blanco y negro */
--color-primary:    #C8102E;   /* Rojo italiano */
--color-secondary:  #1A1A1A;   /* Negro elegante */
--color-accent:     #F5C518;   /* Dorado/amarillo pizza */
--color-bg:         #FAFAF8;   /* Blanco cálido */
--color-text:       #1A1A1A;

/* Propuesta B — Moderna oscura: dark mode con rojo */
--color-primary:    #E63946;   /* Rojo vibrante */
--color-bg:         #141414;   /* Negro profundo */
--color-surface:    #1E1E1E;
--color-accent:     #FFB703;   /* Dorado queso */
--color-text:       #F1FAEE;
Preguntar al cliente cuál prefiere antes de generar. Si no tiene preferencia, usar Propuesta A.

Tipografía
text
Display (headings): Oswald o Playfair Display — fuerte, gastronómico, legible
Body:               Work Sans o Nunito — limpio, accesible, moderno
Cargar via Google Fonts. Nunca usar Arial o Helvetica como fuente principal.

Estilo visual
Mobile-first — el 80%+ del tráfico será móvil

Fotos grandes, apetitosas, a full bleed en el hero

Precio siempre visible junto a cada producto (contexto venezolano: mostrar en $ o €)

Botones grandes con esquinas ligeramente redondeadas (radius-md)

Sombras cálidas que evocan horno de leña

Sin gradientes artificiales, sin orbes, sin decoración genérica

Textos y copy base (ajustar según datos reales obtenidos)
text
TAGLINE HERO:
"Las pizzas más sonadas de Valencia. Hechas a leña, con ingredientes frescos."

SUBTÍTULO:
"Más de 17 variedades. Pequeña, mediana y familiar. Desde $2.99."

CTA PRINCIPAL:
"Ver menú completo" / "Pedir por WhatsApp"

SECCIÓN NOSOTROS:
"Somos mucho más que una pizzería. Somos 007.
Desde Valencia para toda Venezuela — masa artesanal, horno a leña,
y tres salones con alma italiana: Nápoles, Roma y Venecia."

SEDES HERO:
"Dos sedes en Valencia. Zona Norte y Centro.
Lunes a sábado desde las 11am. Todos los días hasta las 11pm."
Regla crítica: No inventar precios, fechas de fundación, premios ni frases
que no vengan del Instagram o no hayan sido confirmadas por el usuario.
Si un dato es incierto, dejar un [CONFIRMAR: ...] en el código como marcador.

Entregables finales
text
pizzeria007-web/
├── pizzeria007.html       ← Web completa, un solo archivo
└── assets/
    ├── instagram/         ← Fotos descargadas del perfil
    ├── logo-007.svg       ← Logo SVG generado (o extraído)
    └── og-image.jpg       ← Imagen para compartir en redes (1200x630)
El archivo HTML debe:

Pesar menos de 1MB sin imágenes

Cargarse en menos de 2 segundos en móvil (3G)

Tener etiquetas SEO básicas: title, description, og:image, canonical

Incluir schema.org LocalBusiness + Restaurant para Google

Tener modo oscuro/claro con toggle

SEO local básico (incluir siempre)
xml
<!-- En el <head> -->
<title>Pizzería 007 Valencia | Pizza artesanal a leña — Centro y Norte</title>
<meta name="description" content="Las mejores pizzas de Valencia, Venezuela.
  Más de 17 variedades hechas a leña. 2 sedes: Centro y Av. Monseñor Adams.
  Desde $2.99. Lunes a sábado 11am–5pm. Todos los días hasta las 11pm.">
<meta property="og:title" content="Pizzería 007 Valencia">
<meta property="og:image" content="./assets/og-image.jpg">
<link rel="canonical" href="https://pizzeria007.com"> <!-- confirmar dominio -->

<!-- Schema.org Restaurant -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Pizzería 007",
  "servesCuisine": "Pizza, Italiana",
  "priceRange": "$",
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "Av. Monseñor Adams, Local 1 y 2",
      "addressLocality": "Valencia",
      "addressRegion": "Carabobo",
      "addressCountry": "VE"
    }
  ],
  "openingHours": "Mo-Sa 11:00-23:00",
  "sameAs": [
    "https://www.instagram.com/pizzeria007",
    "https://www.facebook.com/p/pizzeria007-100083463875552/"
  ]
}
</script>
Publicación (paso final)
Una vez generado el HTML, decirle al usuario:

"Tu web está lista. Para publicarla tienes estas opciones:

Opción rápida (gratis en 2 minutos):
Entra a netlify.com → arrastra la carpeta pizzeria007-web/ → listo.

Con dominio propio:
Sube el HTML a tu hosting actual o configura el dominio en Netlify.

Con Vercel (si usas Next.js luego):
Muéstrame y lo migramos juntos."

Iteración
Después de generar, aceptar instrucciones como:

"Cambia el color primario a verde"

"Agrega la promo del combo familiar"

"Quita la sección de reservas"

"El WhatsApp de delivery es 0414-XXXXXXX"

"Añade un video de TikTok"

Aplicar cambios quirúrgicos sin reescribir todo el HTML.