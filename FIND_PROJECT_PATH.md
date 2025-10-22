# Finding Your Project Path on Windows 📁

If you're getting "The system cannot find the path specified", here's how to find the correct path:

## Method 1: Using File Explorer (Easiest)

1. **Open File Explorer** (Windows key + E)
2. **Navigate to your project folder** (where you can see files like `package.json`, `README.md`, etc.)
3. **Click on the address bar** at the top (where it shows the folder path)
4. **Copy the full path** (Ctrl + C)
5. **Use this path in Command Prompt**

Example: If your path is `C:\Users\YourName\Desktop\wonder-dating-app`, use:
```cmd
cd C:\Users\YourName\Desktop\wonder-dating-app
```

## Method 2: Using Command Prompt Navigation

1. **Open Command Prompt**
2. **See where you are currently**:
   ```cmd
   cd
   ```
3. **List files and folders**:
   ```cmd
   dir
   ```
4. **Navigate step by step**:
   ```cmd
   cd Desktop
   cd wonder-dating-app
   ```

## Method 3: Drag and Drop (Windows 10/11)

1. **Open Command Prompt**
2. **Type `cd ` (with a space after cd)**
3. **Drag your project folder** from File Explorer into Command Prompt
4. **Press Enter**

## Common Locations to Check

Your project might be in one of these locations:

```cmd
# Desktop
cd C:\Users\%USERNAME%\Desktop\wonder-dating-app

# Downloads folder
cd C:\Users\%USERNAME%\Downloads\wonder-dating-app

# Documents
cd C:\Users\%USERNAME%\Documents\wonder-dating-app

# Root of C drive
cd C:\wonder-dating-app
```

## How to Verify You're in the Right Place

Once you navigate to your project folder, check if these files exist:
```cmd
dir
```

You should see files like:
- `package.json`
- `README.md`
- `AppEntry.tsx`
- `backend` (folder)
- `app` (folder)

## If You Can't Find Your Project

If you can't find the wonder-dating-app folder anywhere:

### Option A: Download/Clone Again
If you haven't made changes, you might need to download or clone the project again.

### Option B: Search for It
1. **Press Windows key**
2. **Type**: `wonder-dating-app`
3. **Look for the folder in search results**

### Option C: Create in a Known Location
1. **Create a new folder on Desktop**:
   ```cmd
   cd C:\Users\%USERNAME%\Desktop
   mkdir wonder-dating-app
   cd wonder-dating-app
   ```
2. **Copy all the project files here**

## Complete Example

Here's a complete example of finding and navigating to your project:

```cmd
# Step 1: See where you are
cd

# Step 2: Go to your user folder
cd C:\Users\%USERNAME%

# Step 3: List folders to see what's available
dir

# Step 4: Check common locations
cd Desktop
dir

# Step 5: If you see wonder-dating-app folder
cd wonder-dating-app

# Step 6: Verify you're in the right place
dir
```

You should see output like:
```
Volume in drive C is Windows
Directory of C:\Users\YourName\Desktop\wonder-dating-app

12/07/2023  10:30 AM    <DIR>          .
12/07/2023  10:30 AM    <DIR>          ..
12/07/2023  10:30 AM    <DIR>          app
12/07/2023  10:30 AM    <DIR>          backend
12/07/2023  10:30 AM             1,234 AppEntry.tsx
12/07/2023  10:30 AM             2,345 package.json
12/07/2023  10:30 AM            15,678 README.md
```

## Once You Find the Correct Path

Replace the path in all commands with your actual path:

```cmd
# Replace this generic path:
cd C:\path\to\your\wonder-dating-app

# With your actual path, for example:
cd C:\Users\John\Desktop\wonder-dating-app
```

## Quick Test

To make sure you're in the right place, run:
```cmd
type package.json
```

This should show the contents of the package.json file. If you see JSON content with "wonder-dating-app" in it, you're in the right place!