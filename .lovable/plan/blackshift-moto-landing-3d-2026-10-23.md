# BLACKSHIFT Moto — Landing 3D

Taller de motos en Inca, Mallorca · Tel/WhatsApp 663 236 307

## Dirección visual
- Paleta "Carbón y brasa": fondos #1a1a1a / #2d2d2d, grises #4a4a4a, acento brasa #e85d3a.
- Tipografía: Bebas Neue (títulos enormes, mayúsculas) + Barlow (texto).
- Estética de taller industrial: texturas de metal, líneas diagonales, números grandes, brillo naranja de chispa.

## Secciones (una sola página con scroll)
1. **Portada 3D**: moto 3D a pantalla completa que gira lentamente y reacciona al ratón, luz naranja tipo neón de taller, chispas flotando. Título "BLACKSHIFT MOTO" y botones Llamar / WhatsApp.
2. **Servicios**: tarjetas con inclinación 3D al pasar el ratón (mantenimiento, mecánica, neumáticos, diagnóstico, preparación ITV, personalización).
3. **Reseñas destacadas** (sección protagonista): carrusel 3D giratorio de tarjetas de reseñas con estrellas, nombre y moto del cliente, nota media grande (ej. 4.9) y contador.
4. **Por qué nosotros**: cifras animadas (años, motos reparadas, etc.).
5. **Visítanos**: mapa de Inca, horario, dirección, botones Llamar y WhatsApp.
6. Botón flotante de WhatsApp siempre visible + pie de página.

## Contenido inventado (a confirmar)
Reseñas, horario, dirección exacta y cifras serán de ejemplo; te pediré los reales al terminar.

## Detalles técnicos
- React Three Fiber + drei; modelo de moto GLB libre (CC0), con alternativa procedural si no hay modelo válido. Escena cargada solo en cliente.
- Carrusel de reseñas en CSS 3D (perspective/rotateY) con autoplay y controles.
- Mapa con iframe de Google Maps (Inca). Enlaces `tel:+34663236307` y `https://wa.me/34663236307`.
- Fuentes vía `<link>` en el root; tokens en src/styles.css; head() con título y descripción propios.
- Verificación con capturas en navegador.
