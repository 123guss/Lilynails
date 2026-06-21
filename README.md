# Lily Nails — Catálogo

Sitio del catálogo de uñas de Lily Nails.

## Estructura

```
index.html          → página pública del catálogo (clientes)
admin/index.html     → panel privado para publicar/eliminar diseños
css/styles.css        → estilos del sitio público
admin/admin.css       → estilos del panel
js/catalog.js         → lógica del catálogo (lee de Firestore)
admin/admin.js         → lógica del panel (login, subir, eliminar)
js/firebase-config.js  → AQUÍ van tus llaves de Firebase
```

## Pendiente antes de funcionar

1. Reemplazar los valores en `js/firebase-config.js` con las llaves reales de tu proyecto de Firebase.
2. En Firebase, activar **Authentication** (método: correo/contraseña) y crear el usuario de Lily ahí.
3. Activar **Firestore Database** (modo producción).
4. Crear una cuenta gratis en **Cloudinary** (sin tarjeta) para guardar las fotos, y pegar el "cloud name" y "upload preset" en `firebase-config.js`.
5. Pegar las reglas de seguridad de abajo en Firestore Rules.
6. Subir a GitHub y activar GitHub Pages.

## Por qué Cloudinary y no Firebase Storage

Firebase Storage ahora exige el plan de pago "Blaze" (que sigue siendo gratis para este uso,
pero pide una tarjeta registrada). Para no necesitar tarjeta, las fotos se guardan en
**Cloudinary** en su lugar — es gratis hasta 25GB, no pide tarjeta, y funciona igual de bien.
Firestore (los datos: nombre, precio, categoría) sigue siendo de Firebase.

## Reglas de seguridad — Firestore

En Firebase → Firestore Database → pestaña "Reglas":

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /designs/{designId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Esto deja que **cualquiera pueda ver** el catálogo (necesario para que los clientes lo vean sin iniciar sesión), pero **solo alguien con sesión iniciada** (es decir, Lily) puede agregar, editar o borrar diseños.

## El link del panel de Lily

El panel vive en `/admin/`. No está enlazado desde ninguna parte del sitio público —
solo quien tenga el link directo puede llegar ahí. Aun así, tiene su propio login con
correo y contraseña real (Firebase Authentication), así que está protegido de verdad,
no solo "escondido".

Ejemplo de link final: `https://tu-usuario.github.io/admin/`
