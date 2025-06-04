# Étape 1 : Image de base légère avec Python 3.11
FROM python:3.11-slim

# Étape 2 : Installation des dépendances système
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc build-essential libpq-dev \
    && pip install --no-cache-dir poetry==2.1.2 \
    && apt-get purge -y --auto-remove build-essential \
    && rm -rf /var/lib/apt/lists/*

# Étape 3 : Définir le répertoire de travail
WORKDIR /app

# Étape 4 : Copier les fichiers nécessaires à l’installation
COPY pyproject.toml ./

# Étape 5 : Configuration de Poetry pour installer dans l’environnement global
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Étape 6 : Copier le reste de l'application
COPY . .


