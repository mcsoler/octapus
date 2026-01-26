from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from alerts.models import Alert, Evidence
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with mock alerts and evidences'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Evidence.objects.all().delete()
            Alert.objects.all().delete()
            self.stdout.write(self.style.WARNING('Existing data cleared.'))

        # Create or get a default user
        user, created = User.objects.get_or_create(
            username='msoler',
            defaults={
                'email': 'msoler@akicti.local',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            user.set_password('Aura5849*')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created msoler user (password: Aura5849*)'))
        else:
            self.stdout.write(f'Using existing user: {user.username}')

        # Mock alerts data (status must be: open, in_progress, closed)
        alerts_data = [
            {'title': 'Phishing Attack Detected', 'severity': 'critical', 'status': 'open'},
            {'title': 'Suspicious Login Activity', 'severity': 'high', 'status': 'in_progress'},
            {'title': 'Malware Signature Found', 'severity': 'high', 'status': 'open'},
            {'title': 'Data Exfiltration Attempt', 'severity': 'critical', 'status': 'closed'},
            {'title': 'Unusual Network Traffic', 'severity': 'medium', 'status': 'open'},
            {'title': 'Port Scan Detected', 'severity': 'medium', 'status': 'open'},
            {'title': 'Brute Force Attack', 'severity': 'high', 'status': 'in_progress'},
            {'title': 'SQL Injection Attempt', 'severity': 'critical', 'status': 'closed'},
            {'title': 'Suspicious File Download', 'severity': 'medium', 'status': 'open'},
            {'title': 'Unauthorized Access Attempt', 'severity': 'high', 'status': 'open'},
            {'title': 'DDOS Attack Pattern', 'severity': 'critical', 'status': 'in_progress'},
            {'title': 'XSS Vulnerability Scan', 'severity': 'medium', 'status': 'closed'},
            {'title': 'Credential Stuffing', 'severity': 'high', 'status': 'open'},
            {'title': 'Zero-Day Exploit', 'severity': 'critical', 'status': 'in_progress'},
            {'title': 'Ransomware Detection', 'severity': 'critical', 'status': 'open'},
            {'title': 'Insider Threat Indicator', 'severity': 'medium', 'status': 'open'},
            {'title': 'Outbound Connection to Known C2', 'severity': 'high', 'status': 'in_progress'},
            {'title': 'Privilege Escalation', 'severity': 'high', 'status': 'open'},
            {'title': 'Certificate Revocation', 'severity': 'low', 'status': 'open'},
            {'title': 'Policy Violation', 'severity': 'low', 'status': 'closed'},
        ]

        # Evidence sources and summaries
        sources = ['twitter', 'linkedin', 'instagram', 'web', 'agent']
        summaries = [
            'Suspicious tweet with malicious link detected',
            'Phishing email targeting finance department',
            'Unusual outbound traffic to unknown IP',
            'Malware signature detected on workstation',
            'Credential dump posted on dark web forum',
            'Mentions of organization in threat actor tweets',
            'Port scanning activity from external IP',
            'Suspicious process execution detected',
            'DNS query to known malicious domain',
            'Lateral movement attempt detected',
            'Suspicious PowerShell execution',
            'Unusual file access pattern detected',
            'Registry modification by unknown process',
            'Network connection to Tor exit node',
            'Failed authentication attempts spike',
        ]

        self.stdout.write('Creating alerts and evidences...')

        alerts_created = 0
        evidences_created = 0

        for alert_data in alerts_data:
            alert = Alert.objects.create(
                title=alert_data['title'],
                severity=alert_data['severity'],
                status=alert_data['status'],
                owner=user
            )
            alerts_created += 1

            # Create random number of evidences for each alert (5 to 10)
            num_evidences = random.randint(5, 10)
            for i in range(num_evidences):
                is_reviewed = random.choice([True, False, False])  # 33% chance of being reviewed
                Evidence.objects.create(
                    alert=alert,
                    source=random.choice(sources),
                    summary=f"{random.choice(summaries)} - Evidence #{i+1}",
                    is_reviewed=is_reviewed,
                    reviewed_by=user if is_reviewed else None,
                    reviewed_at=timezone.now() if is_reviewed else None
                )
                evidences_created += 1

        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {alerts_created} alerts and {evidences_created} evidences!'
        ))
        self.stdout.write('')
        self.stdout.write('You can now login with:')
        self.stdout.write(f'  Username: msoler')
        self.stdout.write(f'  Password: Aura5849*')
