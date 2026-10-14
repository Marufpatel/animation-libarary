"""Export the shared React/SVG timeline to a silent 1080p MP4.
Run `bun run dev` first. Requires Python Playwright, Chrome and ffmpeg.
Usage: python render.py --output /absolute/path/cricket-motion.mp4
Optional: --settings /path/to/cricket-settings.json
"""
import argparse
import concurrent.futures
import json
import shutil
import subprocess
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--output', default='cricket-motion.mp4')
parser.add_argument('--settings')
parser.add_argument('--workers', type=int, default=4)
parser.add_argument('--url', default='http://localhost:4200/cricket?render=1', help='Running managed studio render route')
args = parser.parse_args()
root = Path(__file__).parent
output = Path(args.output).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
settings = Path(args.settings).read_text() if args.settings else None
frames = Path(tempfile.mkdtemp(prefix='cricket-render-'))
count = 750
width, height = 1920, 1080

def render_range(worker):
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which('google-chrome') or shutil.which('chromium'), args=['--no-sandbox'])
        page = browser.new_page(viewport={'width':width, 'height':height}, device_scale_factor=1)
        if settings:
            page.add_init_script('localStorage.setItem("cricket-settings", '+json.dumps(settings)+');')
        page.goto(args.url)
        page.wait_for_function('window.setFilmFrame !== undefined')
        page.evaluate('document.fonts.ready')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        for frame in range(worker, count, args.workers):
            page.evaluate('(frame) => window.setFilmFrame(frame)', frame)
            page.screenshot(path=str(frames / f'{frame:04d}.png'), animations='disabled')
        browser.close()
        if errors:
            raise RuntimeError(errors)
        print(f'Capture worker {worker + 1} complete', flush=True)

with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
    list(pool.map(render_range, range(args.workers)))
assert len(list(frames.glob('*.png'))) == count
subprocess.run(['ffmpeg','-y','-v','error','-framerate','30','-i',str(frames / '%04d.png'),'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-an',str(output)],check=True)
shutil.rmtree(frames)
print(f'Exported {output}: {count} frames, {count/30:g} seconds, {width} × {height}, silent.', flush=True)
