f'Please use Python {3.6} or later'

import os
import shutil
import subprocess


replacements = [
    ('"value": "https://ilmsfreeze.afq984.org"', '"value": "*"'),
    ('https://ilmsfreeze.afq984.org', 'http://localhost'),
    ('ilmsfreeze.afq984.org', 'localhost'),
]

outdir = 'localhost-chrome-extension'
files = subprocess.check_output(['git', 'ls-files', '-z', 'chrome-extension'], encoding='utf-8').split('\0')
if os.path.exists(outdir):
    shutil.rmtree(outdir)
for path in files:
    if not path:
        continue

    outpath = f'localhost-{path}'
    os.makedirs(os.path.dirname(outpath), exist_ok=True)

    if path.endswith('.png'):
        shutil.copy(path, outpath)
    else:
        with open(path) as f:
            content = f.read()

        for from_, to in replacements:
            content = content.replace(from_, to)
        with open(outpath, 'w') as f:
            f.write(content)

    print('written', outpath)
