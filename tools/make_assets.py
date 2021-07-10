import subprocess
import glob
import os


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
    src, = glob.glob(f'material-design-icons/src/*/{icon}/materialicons/24px.svg')
    subprocess.check_call(['convert', src, dst])
