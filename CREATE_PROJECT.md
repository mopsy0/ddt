# Creating Wonder Dating App from Scratch 🚀

Since you haven't created the project folder yet, let's set it up step by step.

## Method 1: Create Project on Desktop (Recommended)

### Step 1: Create the Project Folder

1. **Open Command Prompt**
2. **Navigate to Desktop**:
   ```cmd
   cd C:\Users\%USERNAME%\Desktop
   ```
3. **Create the project folder**:
   ```cmd
   mkdir wonder-dating-app
   ```
4. **Enter the folder**:
   ```cmd
   cd wonder-dating-app
   ```

### Step 2: Initialize the Project

**Create the main project structure:**
```cmd
mkdir backend
mkdir app
mkdir types
```

**Create the main files:**
```cmd
echo. > package.json
echo. > README.md
echo. > AppEntry.tsx
echo. > app.json
```

### Step 3: Set Up Backend Structure

```cmd
cd backend
mkdir src
cd src
mkdir config
mkdir middleware
mkdir models
mkdir routes
mkdir services
mkdir python
mkdir types
cd ..\..
```

### Step 4: Create Essential Files

**Backend package.json:**
```cmd
cd backend
```

Copy and paste this into a new file called `package.json`:
```json
{
  "name": "wonder-backend",
  "version": "1.0.0",
  "description": "Backend API for Wonder Dating App",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "openai": "^4.20.1",
    "socket.io": "^4.7.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "typescript": "^5.3.3",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.1"
  }
}
```

**Frontend package.json:**
```cmd
cd ..
```

Copy and paste this into a new file called `package.json`:
```json
{
  "name": "wonder-dating-app",
  "version": "1.0.0",
  "main": "AppEntry.tsx",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~49.0.15",
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3"
  }
}
```

## Method 2: Quick Setup with Git (If you have Git)

If you have Git installed:

```cmd
cd C:\Users\%USERNAME%\Desktop
git clone <repository-url> wonder-dating-app
cd wonder-dating-app
```

## Method 3: Download and Extract

If you have a ZIP file of the project:

1. **Download the project ZIP file**
2. **Right-click on the ZIP file** → **Extract All**
3. **Choose Desktop as the location**
4. **Rename the extracted folder** to `wonder-dating-app`

## After Creating the Project Structure

### Step 1: Install Dependencies

**Backend:**
```cmd
cd C:\Users\%USERNAME%\Desktop\wonder-dating-app\backend
npm install
```

**Frontend:**
```cmd
cd C:\Users\%USERNAME%\Desktop\wonder-dating-app
npm install
npm install -g @expo/cli
```

### Step 2: Create Environment File

```cmd
cd backend
echo. > .env
```

Edit the `.env` file with basic configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/wonder-dating
JWT_SECRET=your-secret-key-here
```

### Step 3: Verify Setup

**Check if everything is in place:**
```cmd
cd C:\Users\%USERNAME%\Desktop\wonder-dating-app
dir
```

You should see:
- `backend` folder
- `app` folder
- `package.json`
- `AppEntry.tsx`

## Complete Setup Commands (Copy & Paste)

Here are all the commands in order:

```cmd
REM Create project on Desktop
cd C:\Users\%USERNAME%\Desktop
mkdir wonder-dating-app
cd wonder-dating-app

REM Create basic structure
mkdir backend
mkdir app
mkdir types

REM Create backend structure
cd backend
mkdir src
cd src
mkdir config middleware models routes services python types
cd ..\..

REM You'll need to create the package.json files manually
REM Then install dependencies:

cd backend
npm install

cd ..
npm install
npm install -g @expo/cli
```

## What to Do Next

1. **Create the package.json files** using the JSON content above
2. **Run the install commands**
3. **Start coding!**

The project structure will be:
```
C:\Users\YourName\Desktop\wonder-dating-app\
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
├── app/
├── package.json
├── AppEntry.tsx
└── README.md
```

## Need the Complete Project Files?

If you want all the files I created earlier (with the complete backend API, models, AI services, etc.), let me know and I can guide you through copying all the code files into your new project structure!