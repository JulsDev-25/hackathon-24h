import jwt
from django.conf import settings
from datetime import datetime, timedelta, timezone

def generate_jwt(user):
    now = datetime.now(timezone.utc)
    payload = {
        'id': user.id,
        'username': user.username,
        'exp': now + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS),
        'iat': now
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_jwt(token):
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        print("Token expiré")
        return None
    except jwt.InvalidTokenError:
        print("token non valide")
        return None
