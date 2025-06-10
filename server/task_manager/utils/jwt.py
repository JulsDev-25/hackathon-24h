import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
EXPIRATION_MINUTES = 1440  # 24 heure

def generate_jwt(user):
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user.id,
        'exp': now + timedelta(minutes=EXPIRATION_MINUTES),
        "iat": now,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_jwt(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
