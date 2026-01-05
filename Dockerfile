FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend directory
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application from backend directory
COPY backend/ .

# start.sh is already copied with backend/ above
RUN chmod +x /app/start.sh

# Expose port
EXPOSE 8000

# Run application
CMD ["/app/start.sh"]
