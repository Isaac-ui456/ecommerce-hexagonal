# Guía de Despliegue en WSL (Windows Subsystem for Linux)

Pasos para levantar el backend, la base de datos y el frontend dentro de
WSL (Ubuntu), y consumirlos desde el navegador de Windows.

## 1. Preparar WSL y dependencias del sistema

```bash
# Desde PowerShell (una sola vez, si WSL no está instalado)
wsl --install -d Ubuntu

# Dentro de la terminal de Ubuntu (WSL)
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

## 2. Instalar Node.js (vía nvm, recomendado)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v && npm -v
```

## 3. Instalar y configurar PostgreSQL en WSL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo service postgresql start

# Crear rol y base de datos de la aplicación
sudo -u postgres psql -c "CREATE ROLE ecommerce_app WITH LOGIN PASSWORD 'cambia_esta_clave';"
sudo -u postgres psql -c "CREATE DATABASE ecommerce OWNER ecommerce_app;"
```

> WSL no arranca los servicios automáticamente al abrir la terminal; ejecuta
> `sudo service postgresql start` cada vez que reinicies WSL, o configura
> `systemd` (WSL2 reciente lo soporta activándolo en `/etc/wsl.conf`).

## 4. Clonar/copiar el proyecto y aplicar el esquema

```bash
cd ~
# copia o clona el proyecto "ecommerce-hexagonal" aquí
cd ecommerce-hexagonal/backend

psql -h localhost -U ecommerce_app -d ecommerce -f database/schema.sql
# (opcional) datos de ejemplo
psql -h localhost -U ecommerce_app -d ecommerce -f database/seed.sql
```

## 5. Configurar variables de entorno del backend

```bash
cp .env.example .env
nano .env   # define DB_PASSWORD y JWT_SECRET con valores reales/seguros
```

## 6. Instalar dependencias y levantar la API

```bash
npm install
npm run dev        # nodemon, recarga automática en http://localhost:3000
# o en producción:
# npm start
```

Verifica con: `curl http://localhost:3000/health` → `{"status":"ok"}`

## 7. Levantar el frontend (React + Vite)

En otra terminal WSL:

```bash
cd ~/ecommerce-hexagonal/frontend
cp .env.example .env    # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev              # Vite escucha en 0.0.0.0:5173 (host: true en vite.config.js)
```

## 8. Consumir la aplicación desde el navegador de Windows

WSL2 comparte `localhost` con Windows de forma transparente en la mayoría
de instalaciones modernas, así que basta con abrir en el navegador de
Windows:

- Frontend: `http://localhost:5173`
- Backend (verificación): `http://localhost:3000/health`

Si tu versión de WSL no expone `localhost` automáticamente, obtén la IP de
WSL con `ip addr show eth0` y usa `http://<IP-WSL>:5173` desde Windows, o
agrega una regla de `netsh interface portproxy` para reenviar el puerto.

## 9. Resumen de comandos diarios

```bash
sudo service postgresql start
cd ~/ecommerce-hexagonal/backend  && npm run dev   # terminal 1
cd ~/ecommerce-hexagonal/frontend && npm run dev   # terminal 2
```
