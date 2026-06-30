# Vietnam Community League - Tournament Overlay
A complete rework of [vcl-tournament-overlay-tosu](https://github.com/vncommunityleague/vcl-tournament-overlay-tosu), using [Z-Engine](https://www.npmjs.com/package/@fukutotojido/z-engine) as value change listener. Developed by [ANON TOKYO](https://github.com/FukutoTojido).

## Why this thing exist?
- You hate configuring Lazer but still prefer the design of its tournament overlay
- You prefer using an open-source and highly customizable (if you know how to) solution

## Setup
- Install [tosu](https://github.com/tosuapp/tosu/releases/latest)
- Download the latest release from the [Release](https://github.com/vncommunityleague/vcl-overlay/releases/latest) page of this repository
- Extract the downloaded zip file to `static` folder of tosu.
- Your file structure should be like this
```
static/
└── vcl-overlay/
    ├── assets/
    ├── check.svg
    ├── data.json
    ├── index.html
    └── vcl.svg
```
- Update data in `data.json` file (example is provided in the file)

## Usage
- Add a new Browser Source in OBS:
  - URL: `http://127.0.0.1:24050/vcl-overlay`
  - Width: `1920`
  - Height: `1368`
- Click on `Interact` button below the preview to interact with the overlay
- **Toggle Mappool** to show the mappool panel
  - **Left Click** a beatmap to pick the beatmap for **Left** team
  - **Shift + Left Click** a beatmap to ban the beatmap for **Left** team
  - **Alt + Left Click** a beatmap to protect the beatmap for **Left** team
  - **Right Click** a beatmap to pick the beatmap for **Right** team
  - **Shift + Right Click** a beatmap to ban the beatmap for **Right** team
  - **Alt + Right Click** a beatmap to ban the beatmap for **Right** team
  - **Ctrl + Click / Right Click** a beatmap to remove any ban/pick on the beatmap

## Customization
This overlay allows some customizations without having to modify the source code directly, which includes:
- Overlay Background Image by replacing `assets/background.png`
- Colors of the elements by editing `assets/src/styles/theme.css`

## Development
Just as a head-up, since this overlay is completely reworked on Vite, you cannot directly change the HTML, CSS and JS directly just like the old overlay but rather spin up a development server on your local machine and work with it for modification. After you have done everything, you should build the overlay and paste the files in the `dist` folder to tosu folder again.

- Install [Bun](https://bun.sh/docs/installation)
- Clone the repository and start developing
```
git clone https://github.com/vncommunityleague/vcl-overlay.git
bun install
bun dev
```
- Your overlay should be available at `http://localhost:5173`

## Build
- Build the overlay
```
bun run build
```

## FAQs
**Does this support accuracy?**
- Not only by accuracy but also by max combo or miss count.

**Does this support automatic pick?**
- Removed in this version, old one still has it. 

**Who should I contact to get support?**
- For additional support, DM `itsmehoaq` on Discord (or ping in osu! Tournament Hub) - note that any requests regarding modifying overlay design or functionality will be ignored.
- If you are using this overlay, please make a fork so we know which tournament this is being used for :D

## Screenshots
<img width="1917" height="1075" alt="image" src="https://github.com/user-attachments/assets/69908ac5-8f5e-48dc-9150-da6b44a98e9a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2b1055a6-647c-46a2-b00a-50e4116d8c29" />

