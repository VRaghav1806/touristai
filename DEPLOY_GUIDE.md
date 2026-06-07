# 🚀 Tourist AI Deployment Guide

This guide will walk you through exactly how to deploy your 3-tier application to the internet for free using **Render** (for the Backend and AI Service) and **Vercel** (for the Frontend).

> **IMPORTANT**
> I have already updated your frontend code to dynamically connect to your deployed APIs, and configured `vercel.json` to handle React Router on Vercel!

---

## 1️⃣ Deploy the Node Backend (Render)

We will deploy the `backend` folder as a Web Service on Render.

1. Go to [Render.com](https://render.com/) and sign in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`VRaghav1806/touristai`).
4. Configure the service:
   - **Name**: `touristai-backend` (or similar)
   - **Root Directory**: `backend` *(Crucial!)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Scroll down to **Environment Variables** and add:
   - `MONGO_URI`: *[Your MongoDB connection string]*
6. Click **Create Web Service**. 
7. Once deployed, copy the Render URL (e.g., `https://touristai-backend.onrender.com`).

---

## 2️⃣ Deploy the Python AI Service (Render)

We will deploy the `ai-service` folder as another Web Service on Render.

1. On the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository again.
3. Configure the service:
   - **Name**: `touristai-ai` (or similar)
   - **Root Directory**: `ai-service` *(Crucial!)*
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Instance Type**: Free
4. Scroll down to **Environment Variables** and add:
   - `GROQ_API_KEY`: *[Your Groq API key]*
5. Click **Create Web Service**.
6. Once deployed, copy the Render URL (e.g., `https://touristai-ai.onrender.com`).

---

## 3️⃣ Deploy the Frontend (Vercel)

We will deploy the `frontend` folder to Vercel, linking it to the services you just deployed.

1. Go to [Vercel.com](https://vercel.com/) and sign in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`VRaghav1806/touristai`).
4. Configure the project:
   - **Root Directory**: Click `Edit`, select the `frontend` folder, and save.
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section and add the URLs you copied from Render:
   - Name: `VITE_AI_API_URL`
   - Value: `https://touristai-ai.onrender.com` *(Do not include a trailing slash)*
6. Click **Deploy**.

> **TIP**
> If you ever update your backend code, simply push to your `master` branch on GitHub, and Render/Vercel will automatically trigger a new deployment!
