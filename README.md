Aight Rowdy, let’s flip that repo and make it scream **Rowdy Mail** — your signature brand, not some stock-ass "TempMail V2" clone. Here's a full rebranded version of that README, top-to-bottom, legit and gangster as hell:

---

# 📧 Rowdy Mail - The Ultimate Disposable Email Plug 🔥

<div align="center">

![Rowdy Mail Banner](images/banner.png)

[![GitHub Stars](https://img.shields.io/github/stars/rowdy-raedon/rowdy-mail?style=for-the-badge\&logo=github\&color=yellow)](https://github.com/rowdy-raedon/rowdy-mail/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/rowdy-raedon/rowdy-mail?style=for-the-badge\&logo=github\&color=orange)](https://github.com/rowdy-raedon/rowdy-mail/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/rowdy-raedon/rowdy-mail?style=for-the-badge\&logo=github\&color=red)](https://github.com/rowdy-raedon/rowdy-mail/issues)
[![GitHub License](https://img.shields.io/github/license/rowdy-raedon/rowdy-mail?style=for-the-badge\&logo=github\&color=blue)](https://github.com/rowdy-raedon/rowdy-mail/blob/main/LICENSE)
[![Live Site Status](https://img.shields.io/website?style=for-the-badge\&url=https%3A%2F%2Frowdymail.xyz\&logo=googlechrome\&color=green)](https://rowdymail.xyz)

**Burner Emails. Bulletproof Privacy. Rowdy AF.**

[Live Demo](https://rowdymail.xyz) | [Report Bug](https://github.com/rowdy-raedon/rowdy-mail/issues) | [Request Feature](https://github.com/rowdy-raedon/rowdy-mail/issues)

</div>

---

> 🚨 **Heads Up**
> This ain’t no open buffet. You clone it, you give props. Commercial use? Hit up the OG (Rowdy) for clearance or expect that DMCA smoke.

---

## 🔥 What’s Rowdy Mail?

**Rowdy Mail** is your weapon against spam, tracking, and digital rats. No sign-up. No bullshit. Just click and go. Instant disposable emails, modern dark UI, smooth inbox refresh, real-time vibes — this is the burner email experience turned gangsta.

---

<div align="center">

![Visitors](https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fgithub.com%2Frowdy-raedon%2Frowdy-mail\&label=VISITORS\&labelColor=%23d9e3f0\&countColor=%23263759)

</div>

---

## ✨ Features That Hit Hard

* ⚡ **1-Click Burner Emails** – No fluff, get an inbox in 1 click
* 🔁 **Auto-Refresh Inbox** – Stay in the loop without clickin’
* 🔍 **Search Fast** – Filter through your mail like a boss
* 🌓 **Light/Dark Mode Toggle** – Match your vibe or the ops won’t recognize you
* 📱 **Fully Responsive** – Mobile, desktop, trap phone — don’t matter
* 🔒 **No Sign-Up. Ever.** – Anonymous like a burner phone
* 🚫 **No Junk In Your Inbox** – Drop spam like it’s hot
* 📎 **Attachment Support** – Receive files without worry

---

## 🛠 Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge\&logo=javascript\&logoColor=%23F7DF1E)
![Font Awesome](https://img.shields.io/badge/font%20awesome-%23339AF0.svg?style=for-the-badge\&logo=font-awesome\&logoColor=white)
![Responsive](https://img.shields.io/badge/responsive-%23FF6C37.svg?style=for-the-badge\&logo=amp\&logoColor=white)

* **Frontend:** Straight HTML, CSS, and JavaScript (no BS frameworks)
* **API Source:** GuerrillaMail or your own proxy setup
* **Storage:** Browser localStorage (keeps your settings on lockdown)

---

## 📦 Setup Game

```bash
git clone https://github.com/rowdy-raedon/rowdy-mail.git
cd rowdy-mail
```

### Option 1 – Open `index.html` and flex

### Option 2 – Go local dev:

```bash
npm i -g live-server
live-server
```

Then slide to `http://127.0.0.1:8080` and start wreckin' spam.

---

## 🧠 How to Use Like a Pro

* Click `New Address` – boom, you got mail
* Click `Load Mail` – fetches new drops
* Search by sender, subject, body
* Trash what you don’t need
* Theme switch top right – dark/light
* Toggle Auto-Refresh (10s, 30s, 1m)

---

## 📁 Folder Layout

```
rowdy-mail/
├── css/
├── js/
├── images/
├── privacy/
├── index.html
├── manifest.json
├── LICENSE
└── README.md
```

---

## 💻 Email System Example

```js
const random = Math.random().toString(36).substring(2, 8);
const domain = CONFIG.DOMAINS[Math.floor(Math.random() * CONFIG.DOMAINS.length)];
const email = `${random}@${domain}`;
```

---

## 🎨 Theme Example

```js
if (darkMode) {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}
```

---

## 🔧 Customize It Rowdy-Style

* **Change Domains**: Edit `DOMAINS[]` in `config.js`
* **Theme Colors**: Update CSS variables in `style.css`
* **Refresh Intervals**: Modify dropdown + logic in `api.js`

---

## 🤝 Pull Up & Contribute

* Fork it
* Branch it (`git checkout -b feat/hotUpgrade`)
* Push it
* PR it

We all tryna eat. Don’t be shy.

---

## 📜 License: Rowdy Rules

MIT with restrictions. **Personal & educational use only** — don’t turn this into your SaaS and think it’s sweet.

---

## 🧠 Author: The Kingpin

<div align="center">
  <a href="https://github.com/rowdy-raedon">
    <img src="https://github.com/rowdy-raedon.png" width="100" alt="Rowdy">
    <br />
    <b>Rowdy-👽 | Da Ruler-📏</b>
  </a>
</div>

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/rowdy-raedon)
[![Email](https://img.shields.io/badge/email-%23D14836.svg?style=for-the-badge\&logo=gmail\&logoColor=white)](mailto:rowdy@rowdymail.xyz)

---

## ⚠️ Disclaimer

This tool’s for testing, learning, and personal use only. Don’t be dumb. Don’t be illegal. We ain’t responsible if you catch heat.

---

Wanna drop this as your live project? Make sure:

* **Replace all references to TempMail V2** with "Rowdy Mail"
* **Update image paths + GitHub URLs**
* Update `manifest.json`, `favicon`, and app name where needed

You want me to flip all the actual code and meta info too? I’ll do the dirty work — just say the word.
