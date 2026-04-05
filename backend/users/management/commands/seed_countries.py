from django.core.management.base import BaseCommand

from users.models import Country, CountryTimezone

COUNTRIES_DATA = [
    {"name": "Afghanistan", "iso_code": "AF", "calling_code": "+93", "flag": "\U0001f1e6\U0001f1eb", "timezones": ["Asia/Kabul"]},
    {"name": "Argentina", "iso_code": "AR", "calling_code": "+54", "flag": "\U0001f1e6\U0001f1f7", "timezones": ["America/Argentina/Buenos_Aires"]},
    {"name": "Australia", "iso_code": "AU", "calling_code": "+61", "flag": "\U0001f1e6\U0001f1fa", "timezones": ["Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Perth", "Australia/Adelaide", "Australia/Darwin"]},
    {"name": "Bangladesh", "iso_code": "BD", "calling_code": "+880", "flag": "\U0001f1e7\U0001f1e9", "timezones": ["Asia/Dhaka"]},
    {"name": "Brazil", "iso_code": "BR", "calling_code": "+55", "flag": "\U0001f1e7\U0001f1f7", "timezones": ["America/Sao_Paulo", "America/Manaus", "America/Fortaleza"]},
    {"name": "Canada", "iso_code": "CA", "calling_code": "+1", "flag": "\U0001f1e8\U0001f1e6", "timezones": ["America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"]},
    {"name": "Chile", "iso_code": "CL", "calling_code": "+56", "flag": "\U0001f1e8\U0001f1f1", "timezones": ["America/Santiago"]},
    {"name": "China", "iso_code": "CN", "calling_code": "+86", "flag": "\U0001f1e8\U0001f1f3", "timezones": ["Asia/Shanghai"]},
    {"name": "Colombia", "iso_code": "CO", "calling_code": "+57", "flag": "\U0001f1e8\U0001f1f4", "timezones": ["America/Bogota"]},
    {"name": "Egypt", "iso_code": "EG", "calling_code": "+20", "flag": "\U0001f1ea\U0001f1ec", "timezones": ["Africa/Cairo"]},
    {"name": "Ethiopia", "iso_code": "ET", "calling_code": "+251", "flag": "\U0001f1ea\U0001f1f9", "timezones": ["Africa/Addis_Ababa"]},
    {"name": "France", "iso_code": "FR", "calling_code": "+33", "flag": "\U0001f1eb\U0001f1f7", "timezones": ["Europe/Paris"]},
    {"name": "Germany", "iso_code": "DE", "calling_code": "+49", "flag": "\U0001f1e9\U0001f1ea", "timezones": ["Europe/Berlin"]},
    {"name": "India", "iso_code": "IN", "calling_code": "+91", "flag": "\U0001f1ee\U0001f1f3", "timezones": ["Asia/Kolkata"]},
    {"name": "Indonesia", "iso_code": "ID", "calling_code": "+62", "flag": "\U0001f1ee\U0001f1e9", "timezones": ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"]},
    {"name": "Iran", "iso_code": "IR", "calling_code": "+98", "flag": "\U0001f1ee\U0001f1f7", "timezones": ["Asia/Tehran"]},
    {"name": "Iraq", "iso_code": "IQ", "calling_code": "+964", "flag": "\U0001f1ee\U0001f1f6", "timezones": ["Asia/Baghdad"]},
    {"name": "Ireland", "iso_code": "IE", "calling_code": "+353", "flag": "\U0001f1ee\U0001f1ea", "timezones": ["Europe/Dublin"]},
    {"name": "Israel", "iso_code": "IL", "calling_code": "+972", "flag": "\U0001f1ee\U0001f1f1", "timezones": ["Asia/Jerusalem"]},
    {"name": "Italy", "iso_code": "IT", "calling_code": "+39", "flag": "\U0001f1ee\U0001f1f9", "timezones": ["Europe/Rome"]},
    {"name": "Japan", "iso_code": "JP", "calling_code": "+81", "flag": "\U0001f1ef\U0001f1f5", "timezones": ["Asia/Tokyo"]},
    {"name": "Kenya", "iso_code": "KE", "calling_code": "+254", "flag": "\U0001f1f0\U0001f1ea", "timezones": ["Africa/Nairobi"]},
    {"name": "Malaysia", "iso_code": "MY", "calling_code": "+60", "flag": "\U0001f1f2\U0001f1fe", "timezones": ["Asia/Kuala_Lumpur"]},
    {"name": "Mexico", "iso_code": "MX", "calling_code": "+52", "flag": "\U0001f1f2\U0001f1fd", "timezones": ["America/Mexico_City", "America/Tijuana", "America/Cancun"]},
    {"name": "Morocco", "iso_code": "MA", "calling_code": "+212", "flag": "\U0001f1f2\U0001f1e6", "timezones": ["Africa/Casablanca"]},
    {"name": "Nepal", "iso_code": "NP", "calling_code": "+977", "flag": "\U0001f1f3\U0001f1f5", "timezones": ["Asia/Kathmandu"]},
    {"name": "Netherlands", "iso_code": "NL", "calling_code": "+31", "flag": "\U0001f1f3\U0001f1f1", "timezones": ["Europe/Amsterdam"]},
    {"name": "New Zealand", "iso_code": "NZ", "calling_code": "+64", "flag": "\U0001f1f3\U0001f1ff", "timezones": ["Pacific/Auckland"]},
    {"name": "Nigeria", "iso_code": "NG", "calling_code": "+234", "flag": "\U0001f1f3\U0001f1ec", "timezones": ["Africa/Lagos"]},
    {"name": "Pakistan", "iso_code": "PK", "calling_code": "+92", "flag": "\U0001f1f5\U0001f1f0", "timezones": ["Asia/Karachi"]},
    {"name": "Peru", "iso_code": "PE", "calling_code": "+51", "flag": "\U0001f1f5\U0001f1ea", "timezones": ["America/Lima"]},
    {"name": "Philippines", "iso_code": "PH", "calling_code": "+63", "flag": "\U0001f1f5\U0001f1ed", "timezones": ["Asia/Manila"]},
    {"name": "Poland", "iso_code": "PL", "calling_code": "+48", "flag": "\U0001f1f5\U0001f1f1", "timezones": ["Europe/Warsaw"]},
    {"name": "Portugal", "iso_code": "PT", "calling_code": "+351", "flag": "\U0001f1f5\U0001f1f9", "timezones": ["Europe/Lisbon"]},
    {"name": "Russia", "iso_code": "RU", "calling_code": "+7", "flag": "\U0001f1f7\U0001f1fa", "timezones": ["Europe/Moscow", "Asia/Yekaterinburg", "Asia/Novosibirsk", "Asia/Vladivostok"]},
    {"name": "Saudi Arabia", "iso_code": "SA", "calling_code": "+966", "flag": "\U0001f1f8\U0001f1e6", "timezones": ["Asia/Riyadh"]},
    {"name": "Singapore", "iso_code": "SG", "calling_code": "+65", "flag": "\U0001f1f8\U0001f1ec", "timezones": ["Asia/Singapore"]},
    {"name": "South Africa", "iso_code": "ZA", "calling_code": "+27", "flag": "\U0001f1ff\U0001f1e6", "timezones": ["Africa/Johannesburg"]},
    {"name": "South Korea", "iso_code": "KR", "calling_code": "+82", "flag": "\U0001f1f0\U0001f1f7", "timezones": ["Asia/Seoul"]},
    {"name": "Spain", "iso_code": "ES", "calling_code": "+34", "flag": "\U0001f1ea\U0001f1f8", "timezones": ["Europe/Madrid"]},
    {"name": "Sri Lanka", "iso_code": "LK", "calling_code": "+94", "flag": "\U0001f1f1\U0001f1f0", "timezones": ["Asia/Colombo"]},
    {"name": "Sweden", "iso_code": "SE", "calling_code": "+46", "flag": "\U0001f1f8\U0001f1ea", "timezones": ["Europe/Stockholm"]},
    {"name": "Switzerland", "iso_code": "CH", "calling_code": "+41", "flag": "\U0001f1e8\U0001f1ed", "timezones": ["Europe/Zurich"]},
    {"name": "Thailand", "iso_code": "TH", "calling_code": "+66", "flag": "\U0001f1f9\U0001f1ed", "timezones": ["Asia/Bangkok"]},
    {"name": "Turkey", "iso_code": "TR", "calling_code": "+90", "flag": "\U0001f1f9\U0001f1f7", "timezones": ["Europe/Istanbul"]},
    {"name": "Ukraine", "iso_code": "UA", "calling_code": "+380", "flag": "\U0001f1fa\U0001f1e6", "timezones": ["Europe/Kyiv"]},
    {"name": "United Arab Emirates", "iso_code": "AE", "calling_code": "+971", "flag": "\U0001f1e6\U0001f1ea", "timezones": ["Asia/Dubai"]},
    {"name": "United Kingdom", "iso_code": "GB", "calling_code": "+44", "flag": "\U0001f1ec\U0001f1e7", "timezones": ["Europe/London"]},
    {"name": "United States", "iso_code": "US", "calling_code": "+1", "flag": "\U0001f1fa\U0001f1f8", "timezones": ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu"]},
    {"name": "Vietnam", "iso_code": "VN", "calling_code": "+84", "flag": "\U0001f1fb\U0001f1f3", "timezones": ["Asia/Ho_Chi_Minh"]},
]


class Command(BaseCommand):
    help = "Seed the Country and CountryTimezone tables."

    def handle(self, *args, **kwargs):
        created_countries = 0
        created_timezones = 0

        for entry in COUNTRIES_DATA:
            country, created = Country.objects.update_or_create(
                iso_code=entry["iso_code"],
                defaults={
                    "name": entry["name"],
                    "calling_code": entry["calling_code"],
                    "flag": entry["flag"],
                    "is_active": True,
                },
            )
            if created:
                created_countries += 1

            for tz in entry["timezones"]:
                _, tz_created = CountryTimezone.objects.get_or_create(
                    country=country,
                    timezone=tz,
                )
                if tz_created:
                    created_timezones += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Countries: {created_countries} new, {len(COUNTRIES_DATA)} total. "
                f"Timezones: {created_timezones} new."
            )
        )
