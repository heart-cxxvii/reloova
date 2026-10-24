# RELOOVA Official Website

RELOOVA（リルーヴァ）の公式ランディングページです。学校・地域スポーツで生まれる運動データを研究開発につなぎ、その価値の一部をスポーツ現場へ還元する仕組みを構想しています。

現在は事業アイデアの検証・開発準備段階です。掲載している機能や事業モデルは構想・開発予定であり、導入実績やサービス提供開始を示すものではありません。

## 使用技術

- Astro 7.4.2（Static Site Generation）
- HTML / CSS / 必要最小限のVanilla JavaScript
- React、Vue、Next.js、Tailwind CSS、外部CDNは使用していません

## ディレクトリ構成

```text
.
├── public/
│   └── assets/                 # ロゴ、favicon、写真、OGP画像など
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── sections/           # Hero / About / Product / BusinessModel など
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── README.md
```

## ローカル起動

Node.jsを用意し、ターミナルでプロジェクトフォルダへ移動して実行します。

```bash
cd /path/to/reloova
npm ci
npm run dev
```

表示されたローカルURL（通常は `http://localhost:4321`）をブラウザで開いてください。

## ビルド

```bash
npm run build
```

生成物は `dist/` に出力されます。確認する場合は `npm run preview` を実行します。

## Cloudflare Pages

Cloudflare PagesのGit連携では、次の設定で静的サイトとしてデプロイできます。

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: Astro 7.4.2が動作する安定版（Node.js 22系以上を推奨）

ドメインは未確定のため、canonical URLは設定していません。公開URLが決まった時点で、`src/layouts/BaseLayout.astro`のcanonicalとOGP絶対URLを追加してください。

## コンテンツ・デザインの更新

- ページ全体のメタ情報は `src/layouts/BaseLayout.astro`
- 共通ヘッダー・モバイルナビゲーションは `src/components/Header.astro`
- 各セクションの文章とマークアップは `src/components/sections/`
- 色、余白、レスポンシブレイアウトは `src/styles/global.css`
- ロゴ、favicon、写真、OGP画像は `public/assets/`

連絡先を変更する場合は、`src/components/sections/Contact.astro`のメールアドレスを差し替えてください。
