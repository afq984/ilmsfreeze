import subprocess
import glob
import os
import tempfile

import lxml.etree


ICON_MAPPING = {
    'cal_homework.gif': 'grading',
    'check.gif': 'done',
    'delete2.gif': 'delete',
    'discuss.gif': 'forum',
    'doc2.gif': 'description',
    'edit2.gif': 'edit',
    'find.png': 'search',
    'hot.gif': 'whatshot',
    'info.gif': 'info',
    'item2.gif': 'attachment',
    'link_doc.gif': 'description',
    'lock.gif': 'lock',
    'mail.png': 'email',
    'phone.gif': 'phone',
    'printer.gif': 'print',
    'rss.gif': 'rss_feed',
    'wait.gif': 'hourglass_top',
    'web.gif': 'home',
    'webhd.gif': 'cloud',
    'zoom.jpg': 'zoom_in',
}

OUTDIR = 'freeze-app/sys/res/icon'


os.makedirs(OUTDIR, exist_ok=True)
for asset, icon in ICON_MAPPING.items():
    dst = os.path.join(OUTDIR, asset)
    print(dst)
    (src,) = glob.glob(f'material-design-icons/src/*/{icon}/materialicons/24px.svg')
    svg = lxml.etree.parse(src)
    for g in svg.xpath('//*[local-name()="path"]'):
        if g.attrib.get('fill') == 'none':
            continue
        g.attrib['style'] = 'fill: #4a4a4a'
    with tempfile.TemporaryDirectory() as d:
        png = subprocess.run(
            [
                'inkscape',
                '--pipe',
                f'--export-filename={d}/out.png',
                '--export-type=png',
                '--export-width=16',
                '--export-height=16',
            ],
            input=lxml.etree.tostring(svg),
            check=True,
        )
        subprocess.run(
            ['convert', f'{d}/out.png', dst],
            check=True,
        )
