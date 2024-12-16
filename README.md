# Access Management Microservice

Este microservicio es responsable de manejar la autenticación y el acceso de usuarios en el sistema. Proporciona un endpoint HTTP para login, y utiliza RabbitMQ para escuchar colas relacionadas con eventos de acceso, como es crear un usuario o actualizar contraseña en Users Microservice Management.

## Características  
- Gestión de usuarios: Login.  
- Autenticación mediante JSON Web Tokens (JWT).  
- Integración con RabbitMQ para procesar eventos asíncronos.  
- Estructura modular y escalable.  

---
## Requisitos Previos

Asegúrate de tener instalado lo siguiente:

- **Node.js** (se recomienda la versión 14 o superior).
- **npm** (Administrador de paquetes de Node, incluido con Node.js).
- **Docker** (Levantar las bases de datos)
## Endpoints HTTP  

### **Base URL**: `/api/access`  

### **Endpoints disponibles**  
- **POST `/register`**  
  Registra un nuevo usuario en el sistema.  
  **Parámetros del cuerpo (JSON)**:  
  ```json
  {
    "password": "contraseña_segura",
    "email": "correo@ejemplo.com"
  }


## Intrucciones

### 1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git

cd tu-repositorio

npm install

npx sequelize db:seed:all 

npm run dev
```

## Usuarios disponibles
entro del proyecto, se incluyen al menos 50 usuarios preconfigurados en el archivo users.json. Los usuarios pueden autenticarse utilizando su correo electrónico (email) y su número de RUT (como contraseña). Este archivo contiene las credenciales necesarias para realizar el inicio de sesión, lo que permite probar las funcionalidades del sistema con cuentas predeterminadas.

