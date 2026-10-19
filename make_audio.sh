#!/usr/bin/env bash
set -euo pipefail
cd /home/charles/創業/adventure-film 2>/dev/null || cd /home/charles/创业/adventure-film
ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=f=55:d=40:sample_rate=48000" \
  -f lavfi -i "sine=f=82.407:d=40:sample_rate=48000" \
  -f lavfi -i "sine=f=220:d=40:sample_rate=48000" \
  -f lavfi -i "sine=f=329.628:d=40:sample_rate=48000" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.6:d=40" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "anoisesrc=color=pink:r=48000:a=0.8:d=2.4" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -f lavfi -i "sine=f=52:d=0.6:sample_rate=48000" \
  -filter_complex "$(cat audio.filter)" -map "[aout]" -t 40 -ar 48000 -ac 2 -c:a pcm_s16le out/score.wav
