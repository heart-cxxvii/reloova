# RELOOVA Official Website

RELOOVA（リルーヴァ）の公式ランディングページです。学校・地域スポーツで生まれる運動データを研究開発につなぎ、その価値の一部をスポーツ現場へ還元する仕組みを構想しています。

現在は事業アイデアの検証・開発準備段階です。掲載している機能や事業モデルは構想・開発予定であり、導入実績やサービス提供開始を示すものではありません。

## 使用技術

- Astro 7.4.2（Static Site Generation）
- HTML / Astro
- Tailwind CSS 4
- React、Vue、Next.jsは使用していません
- フォントはGoogle Fonts、アクセス解析はGoogle Tag Manager経由のGoogle Analyticsを使用します

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

## 品質確認

```bash
npm run lint
npm run check
npm run build
```

`lint` は Prettier による整形チェック、`check` は Astro / TypeScript の診断です。
Google Fonts から Zen Kaku Gothic New を読み込み、通信できない場合は日本語システムフォントで表示します。

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

## アクセス解析

- GTMコンテナ: `GTM-N36JCMSV`（RELOOVA / reloova.app）
- GA4プロパティ: `RELOOVA公式サイト`（`562916206`）、アカウント: `RELOOVA`（`415217453`）
- Webストリーム: `RELOOVA公式サイト（Web）`（`16283704913`）、測定ID: `G-NXDVEEN43L`
- [GTM管理画面](https://tagmanager.google.com/#/container/accounts/6402956141/containers/285517851/workspaces/2) / [GA4管理画面](https://analytics.google.com/analytics/web/#/a415217453p562916206/reports/intelligenthome)
- GTMの設置処理: `src/components/GoogleTagManager.astro`
- コンテナIDの指定: `src/layouts/BaseLayout.astro`
- GA4の接続先と計測設定はGTMで管理し、サイトへ別のGA4タグを直接追加しないでください。
- Cloudflare Pagesの`main`ブランチの本番ビルドだけにGTMを出力します。開発環境とブランチプレビューには出力しません。
- 本番ビルドでも、`reloova.app`と`www.reloova.app`以外のホストではGTMを読み込みません。
- 設置コードはGTM管理画面が発行する最適化済みコンテナ用の形式を使用します。
- フッターの「アクセス解析について」から、Googleのデータ利用と無効化方法を確認できます。

本番用コードを含めたビルド確認は、`CF_PAGES_BRANCH=main npm run build`で実行できます。
計測確認にはGTMのTag AssistantプレビューとGA4のDebugView／リアルタイムを使用してください。

## コンテンツ・デザインの更新

- ページ全体のメタ情報は `src/layouts/BaseLayout.astro`
- 共通ヘッダー・About / Contact ナビゲーションは `src/components/Header.astro`
- 各セクションの文章とマークアップは `src/components/sections/`
- 色、余白、レスポンシブレイアウトは `src/styles/global.css`
- ロゴ、favicon、写真、OGP画像は `public/assets/`

連絡先を変更する場合は、`src/components/sections/Contact.astro`のメールアドレスを差し替えてください。

## 写真素材

トップページで使用するストック写真は外部CDNに依存せず `public/assets/images/` に保管しています。撮影者・出典・ライセンスは同ディレクトリの `ATTRIBUTIONS.md` を確認してください。写真を差し替える場合も、同ファイルに出典とライセンスを追記してください。
