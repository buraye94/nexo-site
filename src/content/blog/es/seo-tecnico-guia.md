---
title: "SEO técnico: guía práctica para que Google y la IA entiendan tu sitio"
description: "Guía práctica de SEO técnico: rastreo, indexación, Core Web Vitals, datos estructurados y acceso de bots de IA para que tu sitio se entienda y se cite."
date: 2026-06-26
lang: es
emoji: "🛠️"
tags: ["seo-tecnico", "core-web-vitals"]
---

El SEO técnico es la parte del SEO que se ocupa de que los buscadores y los modelos de IA puedan acceder a tu sitio, entender su contenido y mostrarlo. No trata de las palabras que escribes, sino de la infraestructura que las sostiene: que tus páginas se puedan rastrear, indexar, cargar rápido y leer sin ambigüedad. Sin esa base, el mejor contenido del mundo queda invisible.

## Rastreo: que los bots puedan llegar a tu contenido

Antes de rankear una página, Google tiene que encontrarla y leerla. Ese proceso se llama rastreo, y lo hacen unos programas que recorren la web siguiendo enlaces.

Si un bot no puede llegar a una página, esa página no existe para el buscador. Los bloqueos suelen ser involuntarios. Un archivo robots.txt mal configurado que cierra secciones enteras, una arquitectura donde páginas importantes quedan a demasiados clics de la home, enlaces internos rotos que cortan el recorrido.

Tres cosas ayudan a que el rastreo fluya:

- Un robots.txt que bloquee solo lo que de verdad no debe rastrearse y deje libre todo lo demás.
- Una estructura de enlaces internos donde cada página relevante sea alcanzable en pocos saltos desde la home.
- Un sitemap XML actualizado, enviado en Google Search Console, que le sirva al buscador de mapa de tu sitio.

El rastreo es el primer cuello de botella. Si falla aquí, nada de lo que venga después importa.

## Indexación: que tus páginas entren al índice de Google

Que una página se rastree no garantiza que se indexe. La indexación es el paso siguiente: Google decide si guarda esa página en su índice, que es de donde saca los resultados cuando alguien busca.

Una página puede quedar fuera del índice por varias razones. Una etiqueta noindex que alguien dejó puesta sin querer. Contenido que Google considera duplicado o de poco valor. Una señal de canonical que apunta a otra URL y le dice a Google que esa es la versión buena.

La herramienta para diagnosticar esto es Google Search Console. Su informe de páginas te dice cuáles están indexadas, cuáles no y por qué. Revisarlo de tanto en tanto evita la sorpresa de descubrir que páginas clave llevaban meses fuera del índice sin que nadie lo notara.

Una regla práctica: cada página que quieres que rankee debe ser indexable, tener una sola versión canónica clara y no estar bloqueada por accidente. Suena obvio, y es de los errores más comunes que existen.

## Core Web Vitals: que tu sitio cargue rápido y bien

Google usa la experiencia de página como señal, y la mide con tres métricas conocidas como Core Web Vitals. Cada una captura una parte distinta de cómo se siente cargar tu sitio.

LCP, Largest Contentful Paint, mide cuánto tarda en aparecer el elemento principal de la página, normalmente la imagen o el bloque de texto más grande. Refleja la velocidad de carga percibida. Un buen LCP está por debajo de 2,5 segundos.

INP, Interaction to Next Paint, mide cuánto tarda la página en responder cuando el usuario interactúa, por ejemplo al tocar un botón. Captura qué tan ágil se siente el sitio. INP reemplazó a la antigua métrica FID y se considera bueno por debajo de 200 milisegundos.

CLS, Cumulative Layout Shift, mide cuánto se mueve el contenido mientras carga. Si has intentado tocar un botón y la página saltó dejándote en otro lado, eso es un CLS alto. Lo bueno está por debajo de 0,1.

Estas métricas no son un lujo de rendimiento. En móvil, donde se concentra buena parte del tráfico, un sitio lento pierde gente antes de que vea nada. Mejorar Core Web Vitals casi siempre significa optimizar imágenes, reducir el peso del código y servir el contenido principal cuanto antes.

## Datos estructurados: que el contenido se lea sin ambigüedad

Los datos estructurados son un código que agregas a tus páginas para describirle al buscador qué es cada cosa. Le dices de forma explícita que esto es un producto, esto su precio, esto una reseña, esto una pregunta frecuente. El formato estándar es schema.org, normalmente implementado con JSON-LD.

El valor es doble. Por un lado, habilita los resultados enriquecidos: esas estrellas de valoración, precios o preguntas desplegables que ves en algunos resultados y que atraen más clics. Por otro, le quitan ambigüedad a tu contenido. En lugar de pedirle a Google que adivine qué significa un número en tu página, se lo dices.

Esa claridad se volvió más importante con la IA. Cuando un modelo decide qué citar al responder, el contenido bien marcado y fácil de interpretar tiene ventaja sobre el que obliga a inferir. Los datos estructurados no garantizan que te citen, pero quitan fricción.

## Acceso de bots de IA: que los modelos puedan leerte

Hay una capa nueva en el SEO técnico que hasta hace poco no existía: el acceso de los rastreadores de IA. Los modelos que responden preguntas, como ChatGPT, Perplexity o las funciones de IA de Google, usan bots propios para leer la web.

Algunos de los que conviene conocer son GPTBot, de OpenAI, PerplexityBot y Google-Extended, el control con el que Google gestiona el uso de tu contenido para sus productos de IA. A cada uno lo permites o lo bloqueas desde tu robots.txt.

Aquí hay una decisión real, no una respuesta única. Si quieres que tu marca aparezca citada en las respuestas de estos sistemas, esos bots tienen que poder leerte. Bloquearlos te saca de esa conversación. Permitirlos significa abrir tu contenido a ese uso. Lo importante es que sea una decisión consciente y no un bloqueo por defecto que te deja fuera de una fuente de visibilidad que crece rápido.

## Por dónde empezar

El SEO técnico se siente abrumador porque toca muchas piezas a la vez. El orden sensato es de abajo hacia arriba. Primero confirma que tus páginas se rastrean e indexan, porque sin eso nada más cuenta. Luego mide tus Core Web Vitals y arregla lo que esté en rojo. Después suma datos estructurados donde aporten y revisa qué hace tu robots.txt con los bots de IA.

La mayoría de problemas técnicos son invisibles desde fuera y solo aparecen cuando alguien los busca. Una [auditoría SEO](/auditoria-seo) ordenada los saca a la luz antes de que cuesten tráfico. Si prefieres entender primero el terreno completo, esta es la base del [SEO técnico](/seo-tecnico) sobre la que se construye todo lo demás.
