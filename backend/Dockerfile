# 🧱 Base image
FROM python:3.11-slim

# 👤 Set work directory inside the container
WORKDIR /app

# 🧰 Install system dependencies (for psycopg2 and others)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 🧾 Copy requirements and install
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 📁 Copy rest of the backend code
COPY . .

# 🌍 Expose port (Render expects your app to listen on 10000)
EXPOSE 10000

# 🚀 Command to start FastAPI
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]
