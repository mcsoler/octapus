from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'


class RegisterRateThrottle(AnonRateThrottle):
    rate = '3/hour'