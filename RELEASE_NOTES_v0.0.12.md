# 🚀 What's New in v0.0.12

### 🌐 Multi-Language Audio Dubs & Complete Track Selection
- **All Language Dubs Available**: Enabled YouTube web embedded player extraction (`web_embedded`), allowing VaultDL to detect and display all available dubbed audio languages (Hindi, Spanish, German, French, Japanese, Korean, Tamil, Telugu, Bangla, Marathi, Punjabi, Russian, Arabic, Portuguese, etc.).
- **Smart Audio Selector**: Highlighted default / original audio tracks and listed all dubbed languages in clean, human-readable dropdown options.
- **Direct Multi-Track Extraction**: Downloads the exact audio dub selected and merges it with the highest quality video stream.

### 🎬 Adobe Premiere Pro & Video Editor Compatibility
- **Fixed Codec Import Errors**: MP4 downloads now automatically transcode merged audio streams into standard **AAC Stereo** (`-c:a aac -b:a 192k`), resolving the common *"unsupported compression type / codec error"* caused by Opus audio streams inside MP4 containers.
- **H.264 / AVC Video Priority**: Enforces H.264/AVC stream preference for `.mp4` downloads so video files import seamlessly into **Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, and Sony Vegas**.

---

## 📦 Downloads & Installation

| File | Description | Size |
| :--- | :--- | :--- |
| **`VaultDLSetup0.0.12.exe`** | Standard Windows installer | ~268 MB |
| **`VaultDLPortable-0.0.12-win.zip`** | Portable standalone zip (extract and run) | ~355 MB |

> **Note for Windows Users**: VaultDL is currently in pre-release and not yet code-signed. If Windows SmartScreen appears during installation, click **"More info"** -> **"Run anyway"**.
