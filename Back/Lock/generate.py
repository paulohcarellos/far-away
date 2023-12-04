from qrcode import QRCode
from os import path
from Lock.models import Terminal

def generate_qrcodes():
    terminals = Terminal.objects.all()

    for terminal in terminals:
        data = f'{{"guid": "{str(terminal.guid)}", "secret": "{terminal.secret}"}}'

        qr = QRCode(
            version=1,
            box_size=10,
            border=4,
        )

        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color='black', back_color='white')

        file_path = path.dirname(__file__) + f'\qrcodes\{terminal.guid}.png'
        img.save(file_path)