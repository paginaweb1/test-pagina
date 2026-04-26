# La Silla Vacía - Casa Sobre la Roca

Proyecto estático optimizado para hosting gratuito o cualquier servidor web básico.

## Cambios aplicados

- Diseño renovado con hero, tarjetas, buscador, vista previa y botones de compartir.
- Imágenes convertidas de PNG a WebP en tamaños responsivos: 480, 720 y 1080 px.
- Carga diferida de imágenes, `srcset`, `sizes`, `decoding="async"` y prioridad solo en la primera imagen.
- CSS y JavaScript separados para mantener el HTML limpio.
- Eliminación de dependencias externas de Font Awesome y html2canvas.
- Función de compartir usando Web Share API; si no está disponible, descarga una versión JPG compatible con WhatsApp y otros canales.
- Service Worker actualizado con estrategia de caché para mejorar la navegación posterior.
- Manifest corregido con íconos reales.
- Mejoras de accesibilidad: textos alternativos, foco visible, `dialog`, `aria`, `skip-link` y soporte para reducción de movimiento.

## Cómo probar

Abre `index.html` directamente o ejecútalo con un servidor local:

```bash
python3 -m http.server 8080
```

Luego entra a:

```text
http://localhost:8080
```

Para producción, sube todo el contenido de esta carpeta al hosting.
