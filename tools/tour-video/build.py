"""Compose the AI Academy product tour with a voice-over.

Usage: python build.py <frames_dir> <out_dir> [lang ...]     (default: en bn)

For each language it:
  1. synthesises one narration clip per scene (edge-tts, voices in narration.json)
  2. sets each scene's length from its clip, so pictures and words stay in step
  3. renders the frames with a slow zoom and crossfades
  4. mixes the narration, normalises loudness, and muxes it in
Writes ai-academy-tour-<lang>.mp4, captions-<lang>.vtt and ai-academy-tour-poster.jpg.

Needs: pip install imageio-ffmpeg pillow edge-tts
"""
import asyncio, glob, json, os, re, subprocess, sys, time

import edge_tts
import imageio_ffmpeg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
frames_dir, out_dir = sys.argv[1], sys.argv[2]
langs = sys.argv[3:] or ["en", "bn"]
os.makedirs(out_dir, exist_ok=True)

FF = imageio_ffmpeg.get_ffmpeg_exe()
T = 0.6          # crossfade length
LEAD = 0.3       # pause before narration starts in each scene
TAIL = 0.4       # pause after narration before the next crossfade
MIN_SCENE = 3.2

spec = json.load(open(os.path.join(HERE, "narration.json"), encoding="utf-8"))
frames = sorted(glob.glob(os.path.join(frames_dir, "*.png")))
assert len(frames) == len(spec["scenes"]), f"{len(frames)} frames but {len(spec['scenes'])} narration lines"


def duration(path):
    err = subprocess.run([FF, "-i", path], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def ts(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


async def synth(lang, work):
    """One clip per scene. Cached clips are reused; the speech service
    throttles bursts, so requests are spaced out and retried."""
    voice = spec["voices"][lang]
    clips = []
    for i, sc in enumerate(spec["scenes"]):
        path = os.path.join(work, f"{lang}-{i:02d}.mp3")
        for attempt in range(8):
            if os.path.exists(path) and os.path.getsize(path) > 1000:
                break
            try:
                await edge_tts.Communicate(sc[lang]["say"], voice).save(path)
            except Exception as e:  # throttled or dropped connection
                wait = min(60, 4 * 2 ** attempt)
                print(f"  {lang}-{i:02d}: {type(e).__name__}, retrying in {wait}s", flush=True)
                if os.path.exists(path):
                    os.remove(path)
                time.sleep(wait)
                continue
            time.sleep(1.5)
        else:
            raise RuntimeError(f"no audio for {lang} scene {i + 1}")
        clips.append(path)
    return clips


def build(lang):
    work = os.path.join(out_dir, f".tts-{lang}")
    os.makedirs(work, exist_ok=True)
    clips = asyncio.run(synth(lang, work))
    lens = [duration(c) for c in clips]
    dur = [max(MIN_SCENE, LEAD + a + TAIL + (T if 0 < i < len(clips) - 1 else T / 2)) for i, a in enumerate(lens)]

    starts, t = [], 0.0
    for d in dur:
        starts.append(t)
        t += d - T
    total = sum(dur) - T * (len(dur) - 1)

    args = [FF, "-y"]
    for f, d in zip(frames, dur):
        args += ["-loop", "1", "-framerate", "30", "-t", f"{d:.3f}", "-i", f]
    for c in clips:
        args += ["-i", c]

    n = len(frames)
    parts = []
    for i in range(n):
        still = i in (0, n - 1)
        z = "1" if still else "min(1+0.0004*on,1.055)"
        parts.append(f"[{i}:v]scale=2304:1296,zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,setsar=1,format=yuv420p[v{i}]")
    prev, offset = "v0", 0.0
    for i in range(1, n):
        offset += dur[i - 1] - T
        parts.append(f"[{prev}][v{i}]xfade=transition=fade:duration={T}:offset={offset:.3f}[x{i}]")
        prev = f"x{i}"
    alabels = []
    for i in range(n):
        ms = int((starts[i] + LEAD) * 1000)
        parts.append(f"[{n + i}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={ms}|{ms}[a{i}]")
        alabels.append(f"[a{i}]")
    parts.append(f"{''.join(alabels)}amix=inputs={n}:normalize=0:dropout_transition=0,loudnorm=I=-16:TP=-1.5:LRA=11,apad,atrim=0:{total:.3f}[aout]")

    mp4 = os.path.join(out_dir, f"ai-academy-tour-{lang}.mp4")
    args += ["-filter_complex", ";".join(parts), "-map", f"[{prev}]", "-map", "[aout]",
             "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "112k", "-ar", "48000", "-t", f"{total:.3f}", "-movflags", "+faststart", mp4]
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    lines = ["WEBVTT", ""]
    for i, sc in enumerate(spec["scenes"]):
        a = starts[i] + LEAD
        b = a + lens[i] + 0.25
        text = sc[lang].get("show", sc[lang]["say"])
        lines += [str(i + 1), f"{ts(a)} --> {ts(b)}", text, ""]
    open(os.path.join(out_dir, f"captions-{lang}.vtt"), "w", encoding="utf-8").write("\n".join(lines))
    print(f"{lang}: {total:.1f}s, {os.path.getsize(mp4) / 1e6:.1f} MB")


for lang in langs:
    build(lang)

# poster: the scored lab scene
Image.open(frames[5]).convert("RGB").resize((1280, 720), Image.LANCZOS).save(os.path.join(out_dir, "ai-academy-tour-poster.jpg"), quality=86)
