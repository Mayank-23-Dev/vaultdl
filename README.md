# VaultDL

VaultDL is a modern, high-performance desktop application for downloading media from hundreds of supported platforms.

## 🚀 Features
- **Four Download Modes**: Video+Audio, Audio Only, Video Only, Thumbnail.
- **Granular Control**: Select specific qualities, formats, audio tracks, and subtitle languages.
- **Queue Management**: Download multiple files concurrently with full pause/resume support.
- **History Tracking**: Keep track of downloaded files and quickly revisit their source URLs.
- **Automated Engine Updates**: Seamlessly stays up to date with platform changes.

## 📥 Installation

VaultDL is currently in a pre-release state and is not yet code-signed. When installing on Windows, you may encounter a **Windows SmartScreen** protection prompt. 

To proceed with the installation:
1. Click **"More info"** on the blue prompt.
2. Click **"Run anyway"** to start the installer.

### 🚀 Portable Version
If you prefer not to use an installer, you can download the **Portable ZIP** version. Simply extract the archive and run `VaultDL.exe`. This version avoids the SmartScreen installer prompt entirely and can be run from any folder or USB drive.

## 🛠️ How to Run Locally (Development Setup)

If you want to run or build VaultDL from the source code, follow these steps:

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed (v18 or higher recommended).
2. **Executables**: VaultDL requires `yt-dlp.exe` and `ffmpeg.exe` to function. 
   - Download the latest [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp/releases)
   - Download the latest [ffmpeg.exe](https://ffmpeg.org/download.html)
   - Place **both `.exe` files directly into the root directory** of this project (next to `package.json`). *Note: These are ignored by Git to respect licensing and keep the repository small.*

### Installation & Running
1. Clone this repository to your local machine.
2. Open a terminal in the project root and install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server (which spins up both the Vite frontend and the Electron wrapper):
   ```bash
   npm run electron
   ```

### Building the Installer
To package the app into a standalone `.exe` setup file:
```bash
npm run build-exe
```
The finished installer will be generated inside the `dist/` folder.

## 📜 Attributions & Licensing

VaultDL is a graphical interface that orchestrates several powerful open-source tools:

*   **[yt-dlp](https://github.com/yt-dlp/yt-dlp)**: Released under the [Unlicense](https://github.com/yt-dlp/yt-dlp/blob/master/LICENSE) (Public Domain). yt-dlp is the primary engine used for media extraction and analysis.
*   **[FFmpeg](https://ffmpeg.org/)**: Licensed under [LGPL v2.1+ / GPL v2+](https://ffmpeg.org/legal.html). FFmpeg is used for stream merging, transcoding, and embedding media assets.

### Legal Disclaimer
VaultDL is provided as-is for educational and personal use. It is a controller for third-party command-line utilities and does not contain code to bypass DRM or technological protection measures. Users are responsible for complying with the terms of service of the platforms they access and ensuring they have the legal right to download the content.
