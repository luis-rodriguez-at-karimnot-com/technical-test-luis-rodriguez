# Technical Test Luis Rodriguez

# librerias para Backend
- NestJS + TypeORM: Para construir la lógica de la aplicación y gestionar la base de datos.

- Multer + fs: Para manejar la carga y almacenamiento de imágenes.

- class-validator + class-transformer: Para validar y transformar los datos de entrada.

- bcryptjs: Para el hash de contraseñas.

- @nestjs/platform-express: Para servir archivos estáticos y configurar Multer.

- @nestjs/config: Para manejar variables de entorno


# librerias para Frontend

- axios (^1.8.3) → Cliente HTTP para hacer peticiones al backend de manera eficiente.

- jwt-decode (^4.0.0) → Decodifica tokens JWT en el frontend sin necesidad de validación.

- zustand (^5.0.3) → Librería ligera para gestionar estado global en React.

- @tailwindcss/postcss (^4.0.14) → Plugin para integrar Tailwind CSS con PostCSS.

- @types/google.maps (^3.58.1) → Tipos de TypeScript para la API de Google Maps.

- tailwindcss (^4.0.14) → Framework de CSS basado en utilidades para estilizar la UI de manera rápida.


# Para ejecutar los proyectos
- Instalar las librerias de ambos ya registrados en package.json con el comando 'npm install'

- En el Backend cambiar el nombre del archivo env por .env y crear la base de datos 'backend' o modificar a sus configuraciones

- Para el backend no es necesario realizar migraciones ya que se sincroniza con el entity

- Iniciar los proyectos con sus respectivos comandos backend: 'npm run start:dev' y frontend: 'npm run dev'

- Ejecutar el Seed con el comando: 'npx ts-node src/scripts/seed.ts'

- El backend correra en el puerto 4000 y el front en el 3000

- Todos los usuarios tienen la contraseña 'password' y el correo del admin es 'admin@example.com'

- En el front al admin lo redirigira hacia el dashboard y el usuario hacia su informacion

- Se puede cambiar algunos status de users a Inactive para probar que no se loguean cuando estan inactivos

# Notas

# Stoppers

- Fue complicado realizar la carga de las imagenes porque se guardaban en base64 pero se implemento con el guardado de url, tambien el servido del asset

- El manejo del state global tambien fue un poco dificil, se trato de implementar lo mejor posible se uso para la implementacion de la interfaz User y se guardaron los datos del user me dio problemas para leer el token asi que se esta guardadndo directamente en el localstorage

- La implementacion de Tailwind y su uso fue un poco confuso ya que solo he usado Bootstrap pero se implemento, aunque no tengo mucho sentido del estilo hize mi mejor esfuerzo, me siento mas comodo con el backend :)

- La implementacion de Maps de google me dio problemas sobre todo con la API-KEY no se implemento el autocompletado ni la seleccion en el mapa

# Bonus implementados (A mi parecer)

- Role-Based Access Control

- TypeScript for both the frontend and backend

- Style the frontend using Material-UI, TailwindCSS

- Add pagination controls

- Implement a global state management solution (o se trató)

# REST CLIENT
- Se agrega mi coleccion de Bruno, mi rest client favorito con llamadas a todos los endpoints, ya esta configurado para despues de hacer el login setear la variable de token para las demas peticiones se puede descargar desde https://www.usebruno.com/ aunque tambien lo agrego para postman :( 