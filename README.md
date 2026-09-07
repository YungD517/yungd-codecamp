# YungD CodeCamp

A full-stack learning platform for the **AWAKE 8.0 Backend Development** track by MSSN UNILAG. Students learn Node.js, Express, and MongoDB through 18 sessions of lessons, quizzes, and code-based assignments.

## Tech Stack

- **Frontend:** React (Vite) — coming soon
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (cloud — free tier)
- **Auth:** bcrypt, JWT (HTTP-only cookies)
- **Security:** Helmet, CORS, rate limiting

---

## Setup Guide (From Scratch)

Follow every step in order. Don't skip anything.

---

### Step 1 — Install Node.js

Node.js is what lets you run JavaScript outside the browser. You need it to run this server.

**Check if you already have it:**

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
node -v
```

If you see a version number like `v18.17.0` or higher, you're good — skip to Step 2.

**If you don't have it:**

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (not "Current")
3. Run the installer — click Next through everything, don't change any settings
4. Close and reopen your terminal
5. Run `node -v` again to confirm it installed

**Also verify npm installed:**

```bash
npm -v
```

npm comes bundled with Node.js. You should see a version number. If not, reinstall Node.js.

---

### Step 2 — Install a Code Editor

If you don't already have one, download [VS Code](https://code.visualstudio.com/). It's free.

**Recommended VS Code extensions (optional but helpful):**
- **Thunder Client** — test your API routes without leaving VS Code (alternative to Postman)
- **ESLint** — catches code errors
- **Prettier** — auto-formats your code

---

### Step 3 — Install Postman (for testing your API)

Postman lets you send requests to your API and see the responses. You'll use it to test every route.

1. Go to [https://www.postman.com/downloads](https://www.postman.com/downloads)
2. Download and install the desktop app
3. Create a free account or skip sign-in

You can also use **Thunder Client** (VS Code extension) instead if you prefer staying in your editor.

---

### Step 4 — Install Git

Git tracks changes in your code and lets you push to GitHub.

**Check if you already have it:**

```bash
git --version
```

If you see a version number, skip to Step 5.

**If you don't have it:**

- **Windows:** Download from [https://git-scm.com](https://git-scm.com). Run the installer with default settings.
- **Mac:** Open Terminal and run `git --version`. It will prompt you to install Xcode Command Line Tools. Click Install.
- **Linux:** Run `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (Fedora/CentOS).

**Set up your identity (first time only):**

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Use the same email you'll use for GitHub.

---

### Step 5 — Create a MongoDB Atlas Account (Free Cloud Database)

You do NOT need to install MongoDB on your computer. Atlas runs in the cloud for free.

**5a. Create an account:**

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with your email or Google account
4. You'll land on the Atlas dashboard

**5b. Create a cluster:**

1. Click "Build a Database" (or "Create" if you see that)
2. Choose the **FREE** tier (M0 Sandbox)
3. Pick a cloud provider — any is fine, AWS is default
4. Pick a region — choose the one closest to you (e.g., if you're in Nigeria, pick Europe or Africa if available)
5. Cluster name — leave the default or name it `yungd-codecamp`
6. Click "Create Deployment"

Wait a minute or two for the cluster to finish creating.

**5c. Create a database user:**

After the cluster is created, Atlas will ask you to set up a database user.

1. Choose "Username and Password" authentication
2. Enter a username (e.g., `yungd`)
3. Enter a password — **use only letters and numbers, no special characters** (this goes into a URL, special characters cause problems)
4. Click "Create User"

**Write down this username and password.** You'll need them in Step 7.

**5d. Set up network access:**

Atlas blocks all connections by default. You need to allow your computer to connect.

1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
4. Click "Confirm"

This is fine for development. When you deploy later, you'll restrict it.

**5e. Get your connection string:**

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Make sure "Node.js" is selected
5. Copy the connection string. It looks like this:

```
mongodb+srv://yungd:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

6. Replace `<password>` with the actual password you created in Step 5c
7. Add your database name before the `?`. Your final string should look like:

```
mongodb+srv://yungd:yourpassword@cluster0.abc123.mongodb.net/yungd-codecamp?retryWrites=true&w=majority
```

**Keep this string. You'll paste it in Step 7.**

---

### Step 6 — Download and Set Up the Project

**6a. Create a folder for the project:**

Open your terminal and navigate to where you keep your projects:

```bash
# Windows
cd C:\Users\YourName\Documents

# Mac/Linux
cd ~/Documents
```

**6b. Unzip the project:**

If you downloaded the zip file from this chat, unzip it. You should see a folder called `yungd-codecamp` with a `server` folder inside it.

Move into the project:

```bash
cd yungd-codecamp
```

**6c. Install dependencies:**

```bash
cd server
npm install
```

This reads `package.json` and installs everything the server needs (Express, Mongoose, bcrypt, etc.) into a `node_modules` folder. This might take a minute.

If you see yellow "WARN" messages, that's normal. Only red "ERR" messages are problems.

---

### Step 7 — Configure Environment Variables

Environment variables keep your secrets (database URL, JWT key) out of your code.

**7a. Create your `.env` file:**

```bash
# Make a copy of the example file
cp .env.example .env
```

If `cp` doesn't work on Windows, just manually copy the file `.env.example` and rename the copy to `.env`.

**7b. Open `.env` in your code editor and fill in the values:**

```
MONGO_URI=mongodb+srv://yungd:yourpassword@cluster0.abc123.mongodb.net/yungd-codecamp?retryWrites=true&w=majority
JWT_SECRET=paste-your-random-string-here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

**For MONGO_URI:** Paste the connection string from Step 5e (with your actual password and database name).

**For JWT_SECRET:** This needs to be a long random string. Generate one by running this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your JWT_SECRET. It will look something like:
```
a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

**Leave the rest as they are for now.**

**IMPORTANT:** Never share your `.env` file. Never push it to GitHub. The `.gitignore` file already prevents this.

---

### Step 8 — Create Your Tutor Account

The tutor account is how you log into the admin dashboard. It's created by running a script — nothing is hardcoded in the app.

**8a. Open `server/seed.js` in your code editor.**

Find these two lines and change them:

```js
email: "tutor@yungdcodecamp.com",     // ← put your real email
password: "CHANGE_THIS_PASSWORD",      // ← put a strong password
```

Change them to something like:

```js
email: "fawazyunusayoola@gmail.com",
password: "YourStrongPassword123",
```

**Save the file.**

**8b. Run the seed script:**

Make sure you're in the `server` folder, then run:

```bash
node seed.js
```

You should see:

```
Connected to MongoDB
Tutor account created successfully:
  Name: YungD
  Email: fawazyunusayoola@gmail.com
  Role: tutor
```

If you see a connection error, go back to Step 5 and double-check your MONGO_URI, your database user password, and that your IP is allowed in Network Access.

**Your tutor account is now in the database.** The password is hashed — even if someone accesses your database, they can't read it.

---

### Step 9 — Start the Server

```bash
npm run dev
```

You should see:

```
YungD CodeCamp server running in development mode on port 5000
MongoDB connected: cluster0-shard-00-00.abc123.mongodb.net
```

**Your server is now running at `http://localhost:5000`.**

If you see errors:
- `ECONNREFUSED` or `MongoServerError` → your MONGO_URI is wrong or your IP isn't whitelisted in Atlas
- `Cannot find module` → you didn't run `npm install` in Step 6c
- `EADDRINUSE` → port 5000 is already in use. Change PORT in `.env` to 5001 or kill the other process

---

### Step 10 — Test It

**10a. Health check:**

Open your browser and go to:

```
http://localhost:5000/api/health
```

You should see:

```json
{ "success": true, "message": "YungD CodeCamp API is running" }
```

**10b. Test registration (with Postman or Thunder Client):**

1. Open Postman
2. Create a new request
3. Set method to **POST**
4. Set URL to `http://localhost:5000/api/auth/register`
5. Go to the **Body** tab
6. Select **raw** and change the dropdown to **JSON**
7. Paste this:

```json
{
  "name": "Test Student",
  "email": "test@student.com",
  "password": "test123456"
}
```

8. Click **Send**

You should get a response like:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Student",
    "email": "test@student.com",
    "role": "student"
  }
}
```

**10c. Test login:**

1. Change the URL to `http://localhost:5000/api/auth/login`
2. Change the body to:

```json
{
  "email": "test@student.com",
  "password": "test123456"
}
```

3. Click **Send**

You should get a success response. Check the **Cookies** tab in Postman — you should see a `token` cookie. That's your JWT.

**10d. Test tutor login:**

Same as above but use your tutor email and password from Step 8.

**10e. Test a protected route:**

1. After logging in (the cookie is saved automatically in Postman)
2. Change method to **GET**
3. Set URL to `http://localhost:5000/api/auth/me`
4. Click **Send**

You should see your user data.

---

### Step 11 — Push to GitHub

**11a. Create a GitHub repository:**

1. Go to [https://github.com](https://github.com)
2. Sign in (or create an account if you don't have one)
3. Click the **+** icon in the top right → "New repository"
4. Name it `yungd-codecamp`
5. Set it to **Public** (so your students and recruiters can see it)
6. Do NOT initialize with a README (you already have one)
7. Click "Create repository"

**11b. Push your code:**

Go back to your terminal. Make sure you're in the `yungd-codecamp` root folder (not inside `server`):

```bash
cd ..
```

Then run:

```bash
git init
git add .
git commit -m "feat: complete backend API with auth, sessions, quizzes, assignments"
git branch -M main
git remote add origin https://github.com/YungD517/yungd-codecamp.git
git push -u origin main
```

**Your code is now on GitHub.**

Verify by visiting `https://github.com/YungD517/yungd-codecamp` — you should see all your files and the README displayed below them.

---

## API Endpoints

### Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a student account |
| POST | `/api/auth/login` | Public | Login (returns JWT cookie) |
| POST | `/api/auth/logout` | Private | Logout (clears cookie) |
| GET | `/api/auth/me` | Private | Get current user |

### Sessions (Lessons)

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/sessions` | Private | Get all sessions (content filtered by role) |
| GET | `/api/sessions/:id` | Private | Get single session |
| POST | `/api/sessions` | Tutor | Create a session |
| PUT | `/api/sessions/:id` | Tutor | Update a session |
| DELETE | `/api/sessions/:id` | Tutor | Delete a session |

### Quizzes

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/quizzes/session/:sessionId` | Private | Get quiz for a session |
| POST | `/api/quizzes` | Tutor | Create a quiz |
| PUT | `/api/quizzes/:id` | Tutor | Update a quiz |
| POST | `/api/quizzes/:id/attempt` | Private | Submit quiz attempt |
| GET | `/api/quizzes/:id/attempts` | Private | Get own attempts |
| GET | `/api/quizzes/:id/all-attempts` | Tutor | Get all student attempts |

### Assignments

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/assignments/session/:sessionId` | Private | Get assignments for a checkpoint |
| POST | `/api/assignments` | Tutor | Create an assignment |
| PUT | `/api/assignments/:id` | Tutor | Update an assignment |
| GET | `/api/assignments/:id/submissions` | Tutor | Get all submissions |

### Submissions

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/submissions` | Private | Submit GitHub link |
| GET | `/api/submissions/my` | Private | Get own submissions |
| PUT | `/api/submissions/:id/review` | Tutor | Grade a submission |

### Users

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users/students` | Tutor | Get all students |
| GET | `/api/users/students/:id` | Tutor | Get single student |
| GET | `/api/users/students/:id/progress` | Tutor | Get detailed progress |

---

## Troubleshooting

**"Cannot find module 'express'" or similar:**
You didn't install dependencies. Run `npm install` inside the `server` folder.

**"MongoServerError: bad auth" or "Authentication failed":**
Your MONGO_URI password is wrong. Go to MongoDB Atlas → Database Access → edit your user and reset the password. Update it in your `.env` file. Remember — no special characters in the password.

**"MongoServerError: IP not whitelisted":**
Go to MongoDB Atlas → Network Access → make sure `0.0.0.0/0` is in the list.

**"EADDRINUSE: address already in use :::5000":**
Something else is using port 5000. Either close that process or change `PORT=5001` in your `.env`.

**"Error: listen EACCES":**
On Mac/Linux, ports below 1024 need admin privileges. Use port 5000 or higher.

**Postman shows no cookie after login:**
Make sure you're sending the request to `http://localhost:5000` (not `https`). Cookies won't work over HTTPS on localhost without extra setup.

**Server starts but no "MongoDB connected" message:**
Your MONGO_URI is wrong or your internet is down. Double-check the connection string in `.env`.

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT stored in HTTP-only cookies (not accessible via JavaScript or DevTools)
- Rate limiting on login (10 attempts per 15 minutes)
- CORS restricted to frontend domain only
- Helmet for secure HTTP headers
- Quiz answers validated server-side only (never sent to student browsers)
- Tutor account created via seed script (not hardcoded anywhere)

---

## License

MIT

---

**YungD CodeCamp — Powered by AWAKE 8.0**
