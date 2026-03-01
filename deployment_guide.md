# 🚀 Deployment Guide: Smart Job Tracker

Follow these steps to put your application on the internet using **Render** (free and beginner-friendly).

## 1. Prerequisites
- A **GitHub** account (Done).
- A **MongoDB Atlas** account (Free tier).
- Your latest code pushed to GitHub (Done).

## 2. Database Setup (MongoDB Atlas)
1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new **Cluster** (Shared/Free).
3.  In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4.  In **Database Access**, create a user with a password.
5.  Click **Connect** -> **Connect your application** and copy the `SRV` connection string.

## 3. Deploy to Render
1.  Go to [Render.com](https://render.com/) and sign up with GitHub.
2.  Click **New +** -> **Web Service**.
3.  Connect your `Track-smart` repository.
4.  Configure the service:
    - **Name**: `smart-job-tracker`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
    - **Environment Variables**: Add these in the "Environment" tab:
        - `NODE_ENV`: `production`
        - `MONGO_URI`: (Your MongoDB Atlas string from Step 2)
        - `JWT_SECRET`: (Any long random string)
        - `PORT`: `5000`

## 4. Final Step
1.  Click **Deploy Web Service**.
2.  Once the build finishes, Render will give you a URL (e.g., `https://smart-job-tracker.onrender.com`).
3.  **Anyone with this link can now access your app!**
