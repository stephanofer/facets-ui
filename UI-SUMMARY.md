## Brand

App de finanzas personales (iOS, Android, Web). Estilo premium, limpio, profesional.
Paleta **teal/mint + purple** sobre fondos oscuros profundos o blancos limpios.

## Colores por modo

| Token | Dark | Light |
|-------|------|-------|
| Primary | `#5EEACD` mint | `#0D9488` teal |
| Secondary | `#8B5CF6` purple | `#7C3AED` violet |
| Accent | `#38BDF8` sky | `#0EA5E9` sky |
| Background | `#0A0E17` navy | `#F8FAFB` off-white |
| Card | `#151C2C` | `#FFFFFF` |
| Text | `#F1F5F9` | `#0F172A` |
| Text muted | `#64748B` | `#94A3B8` |
| Border | `white 6%` | `black 6%` |

## Colores semánticos (ambos modos)

- **Income**: `#22C55E` green — **Expense**: `#EF4444` red
- **Warning**: `#F59E0B` amber — **Info**: `#3B82F6` blue
- Cada uno tiene variante `soft` al 12% para fondos de iconos.

## Gradientes

Orbs circulares blurred (70px), opacidad 6–12%, máximo 3 por pantalla.
Solo colores del sistema. Fade-in 500ms. No compiten con el contenido.

- **Dashboard**: glow teal radial arriba + card con diagonal sutil
- **Onboarding**: cada slide tiene orbs temáticos (teal, purple, red/green, sky)

## Superficies y bordes

- Cards: `border 1px` + `border-radius 12px` + sombra suave
- Hover: color/opacity transition 200ms, nunca scale que mueva layout
- Radius: 8 (sm) → 12 (md) → 16 (lg) → 20 (xl) → 9999 (pill)

## Theme Switch

`data-theme="dark|light"` en `<html>`. Persistido en `localStorage`. Toggle con animación 300ms.
Todos los componentes usan CSS variables — cero JS por componente.
