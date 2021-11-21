import argparse
import json
import pathlib
import contextlib


def make_remote(path: pathlib.Path):
    with contextlib.suppress(FileNotFoundError):
        (path / 'credentials.txt').unlink()

    result = []
    for meta_path in path.glob('course/*/meta.json'):
        meta = json.loads(meta_path.read_bytes())
        result.append(meta)

    if result:
        with (path / 'course/all.json').open('w', encoding='utf8') as file:
            json.dump(result, file)


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('path', type=pathlib.Path)
    make_remote(p.parse_args().path)
