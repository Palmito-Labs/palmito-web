# Palmito Labs Web

Web mínima de Palmito Labs para presentar automatización práctica con IA para negocios locales.

El primer producto de Palmito Labs es un asistente de citas para WhatsApp: atiende mensajes, ayuda a ordenar la agenda y deja siempre disponible la intervención humana cuando hace falta.

## Ver en local

```powershell
.\scripts\serve-web.ps1
```

Abrir:

```text
http://localhost:4173
```

## Estructura

```text
index.html
styles.css
assets/
  logo-final/
    png/
    preview.html
    README.md
  logo-drafts/
  png/
scripts/
  serve-web.ps1
```

## Logo

- `assets/logo-final/png/`: recursos finales en PNG para la web, documentos y perfiles.
- `assets/logo-final/preview.html`: hoja visual para revisar la marca.
- `assets/logo-final/README.md`: notas de uso de los recursos finales.
- `assets/logo-drafts/`: pruebas y propuestas de diseño conservadas como histórico.

Los logs locales de tunelado y desarrollo quedan excluidos del repositorio.
