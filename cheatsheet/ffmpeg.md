---
title: FFmpeg 命令速查
description: FFmpeg 常用命令速查表（转码、推流、滤镜、截图等）
---

# 🎬 FFmpeg 命令速查

## 基本信息

```bash title="查看版本"
ffmpeg -version
```

```bash title="查看支持的编码器/解码器"
ffmpeg -encoders
ffmpeg -decoders
ffmpeg -codecs
```

```bash title="查看文件信息"
ffprobe input.mp4
ffprobe -v quiet -print_format json -show_streams input.mp4
```

## 格式转换

```bash title="MP4 → MKV（拷贝流，秒转）"
ffmpeg -i input.mp4 -c copy output.mkv
```

```bash title="MP4 → AVI（重新编码）"
ffmpeg -i input.mp4 output.avi
```

```bash title="WAV → MP3"
ffmpeg -i input.wav -codec:a libmp3lame -q:a 2 output.mp3
```

```bash title="提取音频"
ffmpeg -i input.mp4 -vn -acodec copy output.aac
```

```bash title="提取视频（去掉音频）"
ffmpeg -i input.mp4 -an -vcodec copy output.mp4
```

## 编码参数

```bash title="H.264 编码 + AAC 音频"
ffmpeg -i input.avi -c:v libx264 -c:a aac output.mp4
```

```bash title="指定 CRF 质量（0~51，越小质量越高，推荐 18~28）"
ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4
```

```bash title="指定码率"
ffmpeg -i input.mp4 -b:v 2M -b:a 128k output.mp4
```

```bash title="指定分辨率"
ffmpeg -i input.mp4 -s 1280x720 output.mp4
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4
```

```bash title="H.265 编码（体积更小）"
ffmpeg -i input.mp4 -c:v libx265 -crf 28 output.mp4
```

## 裁剪与拼接

```bash title="截取片段（从第10秒开始，持续30秒）"
ffmpeg -i input.mp4 -ss 00:00:10 -t 30 -c copy output.mp4
```

```bash title="截取到指定时间点"
ffmpeg -i input.mp4 -ss 10 -to 40 -c copy output.mp4
```

```bash title="拼接多个文件"
# 先创建 filelist.txt
# file 'input1.mp4'
# file 'input2.mp4'
ffmpeg -f concat -i filelist.txt -c copy output.mp4
```

## 截图与 GIF

```bash title="截取某一帧（第10秒）"
ffmpeg -i input.mp4 -ss 10 -vframes 1 output.jpg
```

```bash title="每隔 N 秒截一张图"
ffmpeg -i input.mp4 -vf fps=1/10 thumb_%03d.jpg
# fps=1/10 表示每10秒1张
```

```bash title="转 GIF"
ffmpeg -i input.mp4 -ss 0 -t 5 -vf "fps=10,scale=320:-1" output.gif
```

## 滤镜

```bash title="调整亮度"
ffmpeg -i input.mp4 -vf "eq=brightness=0.1" output.mp4
```

```bash title="调整对比度"
ffmpeg -i input.mp4 -vf "eq=contrast=1.2" output.mp4
```

```bash title="调整音量"
ffmpeg -i input.mp3 -af "volume=1.5" output.mp3
```

```bash title="添加文字水印"
ffmpeg -i input.mp4 -vf "drawtext=text='Hello':x=10:y=10:fontsize=24:fontcolor=white" output.mp4
```

```bash title="添加图片水印"
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=10:10" output.mp4
```

```bash title="视频旋转"
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4
# 0=90度逆时针+垂直翻转  1=90度顺时针  2=90度逆时针  3=90度顺时针+垂直翻转
```

## RTSP / RTMP 推流拉流

```bash title="拉流并保存"
ffmpeg -i rtsp://192.168.1.100:554/live -c copy output.mp4
```

```bash title="拉流并播放（使用 ffplay）"
ffplay rtsp://192.168.1.100:554/live
```

```bash title="文件推流到 RTMP"
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream
```

```bash title="RTSP 转 RTMP"
ffmpeg -i rtsp://src/live -c copy -f flv rtmp://dst/live/stream
```

```bash title="循环推流"
ffmpeg -re -stream_loop -1 -i input.mp4 -c copy -f flv rtmp://server/live/stream
```

## 原始 YUV 处理

```bash title="播放 YUV 原始文件"
ffplay -f rawvideo -pix_fmt nv12 -s 1920x1080 input.nv12
ffplay -f rawvideo -pix_fmt yuyv422 -s 1920x1080 input.yuyv
ffplay -f rawvideo -pix_fmt yuv420p -s 1920x1080 input.yuv
```

```bash title="YUV → MP4"
ffmpeg -f rawvideo -pix_fmt nv12 -s 1920x1080 -i input.nv12 -c:v libx264 output.mp4
```

```bash title="MP4 → YUV"
ffmpeg -i input.mp4 -pix_fmt nv12 -f rawvideo output.nv12
```

## 性能优化

```bash title="使用硬件加速（NVIDIA）"
ffmpeg -hwaccel cuda -i input.mp4 -c:v h264_nvenc output.mp4
```

```bash title="多线程编码"
ffmpeg -i input.mp4 -c:v libx264 -threads 4 output.mp4
```

```bash title="快速编码（牺牲压缩率）"
ffmpeg -i input.mp4 -c:v libx264 -preset ultrafast output.mp4
# preset: ultrafast / superfast / veryfast / faster / fast / medium / slow / slower / veryslow
```

---

> 💡 相关知识 → [H.264 编码](/knowledge/video/h264) · [YUV 像素格式](/knowledge/video/yuv)
