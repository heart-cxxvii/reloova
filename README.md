# RELOOVA Official Website

RELOOVA（リルーヴァ）の公式ランディングページです。

RELOOVAは、学校の部活動や地域スポーツクラブで生まれる運動データを研究・製品開発につなぎ、そこから生まれた価値の一部をスポーツ現場へ還元する仕組みを目指す、検証・開発準備段階の事業です。

## ローカルでの確認方法

ビルドは不要です。ターミナルを開き、最初に`cd`（Change Directory）でこのプロジェクトのフォルダへ移動してから、静的ファイルサーバーを起動します。

例：

```bash
cd /path/to/reloova
python3 -m http.server 8000
```

`/path/to/reloova`は、自分のPC上にあるRELOOVAフォルダのパスへ置き換えてください。起動後、ターミナルを閉じずに`http://localhost:8000`をブラウザで開きます。サーバーを停止するときは、ターミナルで`Control + C`を押します。

## ファイル構成

```text
.
├── index.html              # LP本体
├── style.css               # スタイル・レスポンシブ対応
├── script.js               # モバイルナビゲーション等
├── README.md
└── assets/
    ├── logo.svg            # ロゴ（差し替え可能）
    ├── favicon.svg         # favicon（差し替え可能）
    └── images/
        ├── founder-photo-placeholder.svg # 代表者写真の差し替え枠
        ├── og-image.svg    # OGP画像の編集元
        └── og-image.png    # OGP画像（差し替え可能）
```

## 将来の公開について

Cloudflare Pagesへの将来的なデプロイを想定した静的構成です。フレームワーク、npm、ビルド処理、外部CDNは使用していません。デプロイ時はリポジトリ直下を公開ディレクトリとして設定できます。

## 公開前の差し替え項目

- `index.html`内の連絡先メールアドレス（`contact@example.com`）
- `assets/logo.svg`
- `assets/favicon.svg`
- `assets/images/founder-photo-placeholder.svg`（代表者写真へ差し替え）
- `assets/images/og-image.png`
- 公開URL確定後のcanonical URLとOGP画像の絶対URL

## 現在の事業段階について

このWebサイトに記載された機能、データ活用、事業モデルは現在構想・検証中です。導入実績やサービス提供開始を示すものではありません。
