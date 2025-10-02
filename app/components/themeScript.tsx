"use client";

import React from 'react';

// Este script se inyectará directamente en el HTML para evitar el parpadeo del tema.
const ThemeScript = () => {
  const script = `
    (function() {
      // Función para aplicar el tema
      function applyTheme(theme) {
        if (theme === 'dark') {
          document.body.style.backgroundColor = '#232323';
          document.body.classList.add('dark-theme-gradient');
        } else {
          document.body.style.backgroundColor = '#ffffff';
          document.body.classList.remove('dark-theme-gradient');
        }
      }

      try {
        // Lee el tema de localStorage
        var savedTheme = localStorage.getItem('theme');
        // O detecta la preferencia del sistema
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
          applyTheme(savedTheme);
        } else if (prefersDark) {
          applyTheme('dark');
        } else {
          applyTheme('light');
        }
      } catch (e) {
        // En caso de error (localStorage bloqueado, etc.), usa un valor por defecto
        applyTheme('dark');
      }
    })();
  `;

  return (
    <script dangerouslySetInnerHTML={{ __html: script }} />
  );
};

export default ThemeScript;