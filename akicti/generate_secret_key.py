#!/usr/bin/env python3
import secrets
import sys


def generate_secret_key():
    key = secrets.token_urlsafe(50)
    print(f"Generated SECRET_KEY: {key}")
    return key


if __name__ == "__main__":
    generate_secret_key()