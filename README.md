<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<h1 align="center">🔐 Hash Cracker</h1>

<p align="center">
  <img src="assets/logo.png" width="100" alt="logo"/>
</p>

<p align="center">
  <strong>Web based security and cryptography toolkit.</strong>
</p>

![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/abdurrahman101bd/Hash-Cracker)
![GitHub issues](https://img.shields.io/github/issues-raw/abdurrahman101bd/Hash-Cracker)
![GitHub stars](https://img.shields.io/github/stars/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/abdurrahman101bd/Hash-Cracker)
![GitHub issues](https://img.shields.io/github/issues/abdurrahman101bd/Hash-Cracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/abdurrahman101bd/Hash-Cracker)
![Version](https://img.shields.io/badge/version-2.5.5-green.svg)

A comprehensive web-based security and cryptography toolkit featuring hash generation, verification, analysis, 40+ encoding/decoding methods, and a built-in notepad. All operations are performed locally in your browser - no data is ever sent to any server.

> **🎉 v2.5.5** is a bug-fix release that corrects the Encode/Decode history actions, building on the v2.5.0 interface redesign. See "What's New in v2.5.5" below.

<p align="center">
  <a href="https://abdurrahman101bd.github.io/Hash-Cracker">
    <img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge&logo=google-chrome" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/Made%20with-HTML%20%7C%20CSS%20%7C%20JS-orange?style=for-the-badge" alt="Tech">
</p>


---

## 🎉 What's New in v2.5.5

This is a bug-fix release. No tool or logic was changed.

- **Fixed: Encode/Decode history actions hit the wrong entry** – The Restore, Copy and Delete buttons on a history item acted on the mirrored entry instead of the one that was clicked. With several saved items, deleting the newest removed the oldest, and Copy and Restore returned the wrong output. Each button now targets exactly the item it belongs to.

---

## 🎨 v2.5.0 Highlights

This release was a complete visual redesign of the whole app — no tool or logic was changed, every page just looks and feels more professional now.

- **New design system** – Proper typography (Inter for the UI, JetBrains Mono for hashes/code) replacing the old copy-pasted fancy-Unicode text, plus a consistent color system across every page
- **Removed the Matrix rain / floating-shapes background** for a cleaner, modern look
- **Terms & Notes dialog** – A clear first-visit notice explaining what the app does and what it stores, with an "I understand" confirmation; reopenable anytime from the footer
- **Redesigned result panels** – Status-aware result boxes (Idle/Running/Success/Error) with reliable one-click **copy** and **download as .txt**
- **Full history system** – Separate history for Hash Generation, Cracking, Analysis, and the Encode/Decode tool, each with restore, copy, delete, and a confirm dialog before clearing
- **Context-aware tool actions** – The Encode/Decode tool's buttons and messages now match what each tool actually does (Encrypt/Decrypt, Escape/Unescape, Convert, Reverse, Decode-only for JWT/SAML, etc.) instead of a generic Encode/Decode everywhere
- **Live search suggestions** – Instant matching-tool suggestions while typing in the Encode/Decode search bar, plus a cleaner category filter
- **Swap button repositioned** between the input and output fields on the Encode/Decode tool
- **Top-right toast notifications** instead of inline messages
- **Redesigned Notepad** – Color-accented note cards, live character count, an unsaved-changes guard before closing the editor, and better empty states
- **Floating "back to top" button** on the Documentation page
- **Haptic feedback** – A short vibration on copy actions on supported mobile devices

---

## 🌟 Features

### 🔐 Hash Checker

- **Generate Hashes** - Create cryptographic hashes from any text
- **Verify Hashes** - Crack hashes using wordlist-based dictionary attacks
- **Analyze Hashes** - NEW! Identify hash types and get detailed information
- **Multiple Algorithms** - MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **History Tracking** - Separate history for hash generation and verification
- **Performance** - Batch processing with progress tracking for large wordlists

### 🆕 Hash Analyzer

- **Auto-detect Hash Type** - Automatically identify hash algorithms
- **Detailed Analysis** - Get comprehensive information about hash format
- **File Upload Support** - Analyze hashes from text files
- **Manual Input** - Paste hashes directly for instant analysis

### 📝 Notepad

- **Simple Note Taking** - Clean and intuitive interface for quick notes
- **Search Functionality** - Quickly find your notes with built-in search
- **Note Management** - Create, edit, view, and delete notes easily
- **Local Storage** - All notes saved securely in your browser
- **Beautiful UI** - Modern, responsive design with smooth animations

### 🔄 Encode/Decode Tool

- **40+ Encoding Methods** - Comprehensive encoding/decoding toolkit
- **Real-time Processing** - Instant encode/decode operations
- **Category Filtering** - Organized by Base, ASCII, URL, Data, Cipher, and Utilities
- **Live Search Suggestions** - Instant tool suggestions as you type
- **Swap Feature** - Easily exchange input and output
- **Download Output** - Save results directly as a .txt file
- **History** - Every encode/decode is saved, with restore, copy, and delete

### 🎨 Modern, Redesigned Interface

- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Modern UI with engaging transitions
- **Gradient Buttons** - Eye-catching gradient effects on action buttons
- **Floating Back-to-Top** - Quick scroll-to-top button on the Documentation page
- **Top-Right Toasts** - Non-intrusive status notifications
- **Context-Aware Actions** - Buttons and messages adapt to what each tool actually does

---

## 🚀 Quick Start

1. Visit the live demo
2. Select your tool (Hash Generator, Hash Cracker, Hash Analyzer, Encoder, or Notepad)
3. Start using immediately - no installation required!

---

## 🔐 Hash Checker

### Supported Algorithms

| Algorithm   | Output Length      | Status          | Use Case              |
| ----------- | ------------------ | --------------- | --------------------- |
| **MD5**     | 128-bit (32 hex)   | ⚠️ Deprecated   | Checksums only        |
| **SHA-1**   | 160-bit (40 hex)   | ⚠️ Deprecated   | Legacy systems        |
| **SHA-256** | 256-bit (64 hex)   | ✅ Recommended  | Modern applications   |
| **SHA-384** | 384-bit (96 hex)   | ✅ Secure       | High security needs   |
| **SHA-512** | 512-bit (128 hex)  | ✅ Secure       | Maximum security      |

### How to Use

#### Generate Hash

1. Enter your text/password in the input field
2. Select algorithm (SHA-256 recommended)
3. Click "Compute Hash"
4. Copy the result or view in history

#### Crack Hash

1. Upload hash file (.txt) or paste target hash in hex format
2. Select the correct algorithm
3. Upload a wordlist file (.txt)
4. Click "Start Cracking"
5. View results - match found or not found

#### Analyze Hash

1. Upload hash file (.txt) or paste hash directly
2. Click "Analyze"
3. Get detailed information about the hash type and format
4. Identify which algorithm was likely used

### Wordlist Resources

- **[SecLists](https://github.com/danielmiessler/SecLists)** - Comprehensive collection
- **[RockYou](https://github.com/brannondorsey/naive-hashcat/releases)** - 14M+ passwords
- **[10K Common](https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-10000.txt)** - Quick testing
- **[Have I Been Pwned](https://haveibeenpwned.com/Passwords)** - 500M+ database

### Features

- ✅ Client-side processing (100% private)
- ✅ Batch wordlist checking with progress
- ✅ Cancellable operations
- ✅ History tracking (last 50 entries)
- ✅ Performance optimized (500 words/batch)
- ✅ Mobile-friendly interface
- ✅ Hash file upload support
- ✅ Clear input buttons for convenience

---

## 🆕 Hash Analyzer

### What is Hash Analyzer?

The Hash Analyzer is a powerful tool that helps you identify unknown hash types by analyzing their format, length, and characteristics.

### Features

- **Auto-detection** - Automatically identifies hash algorithm based on length and format
- **Multiple Hash Types** - Supports MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **File Upload** - Analyze multiple hashes from a text file
- **Direct Input** - Paste hash for instant analysis
- **Detailed Results** - Shows hash type, length, and algorithm information

### Use Cases

- Identify unknown hash formats in security research
- Verify hash types before attempting to crack
- Learn about different hash algorithms
- Forensic analysis of password hashes

---

## 📝 Notepad

### Simple, Fast & Beautiful Notes

A lightweight notepad application integrated into Hash Cracker for quick note-taking during security research.

### Features

- **Create Notes** - Add new notes with title and content
- **Edit Notes** - Update existing notes anytime
- **Delete Notes** - Remove notes with confirmation dialog
- **Search Notes** - Find notes quickly with search functionality
- **View Mode** - Read notes in a clean, distraction-free view
- **Responsive Design** - Works seamlessly on all devices
- **Local Storage** - Notes saved in browser, completely private

### How to Use

1. Click the **+** (Floating Action Button) to create a new note
2. Enter title and content
3. Click **Save** to store the note
4. Search notes using the search bar
5. Click on any note to view, edit, or delete

### Perfect For

- Security research notes
- Password recovery documentation
- Hash analysis results
- Wordlist information
- Quick reminders
- Technical documentation

---

## 🔄 Encode/Decode Tool

### Encoding Categories

#### 📦 Base Encodings

- Base16 (Hex)
- Base32
- Base58 (Bitcoin-style)
- Base62
- Base64 (Standard & URL-safe)
- Base85 (Ascii85)
- Base91

#### 🔠 ASCII & Number Systems

- Hexadecimal
- Binary
- Octal
- Decimal (ASCII codes)
- Hexdump

#### 🌐 URL & Network

- URL Encoding (RFC 1738)
- URL Encoding (Full)
- Punycode (IDN)
- Quoted-Printable
- UUEncode / XXEncode

#### 💾 Data Format

- HTML Entity Encoding
- HTML Escape
- Unicode Escape
- JSON Escape
- JWT Decode
- SAML Decode

#### 🔤 Ciphers & Transformations

- ROT13
- Caesar Cipher (customizable shift)
- Atbash Cipher
- Morse Code
- Text Reverse
- Case Converters (UPPER, lower, Title)

#### ⚙️ Utilities

- Image ⇄ Base64 converter
- Multiple text transformations

### Usage Examples

#### Base64 Encoding

```
Input:  "Hello World"
Output: "SGVsbG8gV29ybGQ="
```

#### URL Encoding

```
Input:  "hello world!"
Output: "hello%20world%21"
```

#### ROT13

```
Input:  "HELLO"
Output: "URYYB"
```

#### Morse Code

```
Input:  "SOS"
Output: "... --- ..."
```

---

## 🎨 UI Features

### Visual Enhancements

- **Animated Background** - Floating geometric shapes in light mode
- **Matrix Canvas** - Dynamic Matrix rain effect in dark mode
- **Gradient Buttons** - Beautiful gradient effects on primary actions
- **Color-Shifting Brand** - Animated logo text with color transitions
- **Glassmorphism** - Modern blur effects on navigation and modals
- **Smooth Transitions** - Fluid animations throughout the interface

---

### Theme System

- **Dark Mode** - Default elegant dark theme with Matrix effect
- **Light Mode** - Clean light alternative with floating shapes
- **Persistent** - Preference saved in localStorage
- **Smooth Transition** - Animated theme switching

## 🛡️ Security & Privacy

### Privacy Guarantees

- ✅ **100% Client-side** - All operations in browser
- ✅ **No Server** - No data transmission to any server
- ✅ **No Tracking** - No analytics or user tracking
- ✅ **No Cookies** - Only localStorage for preferences
- ✅ **Offline Capable** - Works without internet after load

### Security Notes

- ⚠️ **Encoding ≠ Encryption** - Encoding is reversible, not secure
- ⚠️ **Educational Purpose** - For learning and authorized testing only
- ⚠️ **Weak Algorithms** - MD5 and SHA-1 are cryptographically broken
- ⚠️ **Classical Ciphers** - ROT13/Caesar are not secure

### Best Practices

1. Use SHA-256 or SHA-512 for modern applications
2. Always HTML escape user input to prevent XSS
3. URL encode all query parameters
4. Don't use encoding for security - use encryption
5. Test wordlist attacks only on your own data

---

## 📚 Documentation

### Complete Docs Available

Visit the **Documentation page** (`docs.html`) for:

- Detailed hash algorithm explanations
- Complete encoding reference guide
- Step-by-step usage tutorials
- Security tips and best practices
- Performance considerations
- External resources and RFCs

### Key Concepts

#### Hash Functions

```
Properties:
✓ Deterministic (same input → same output)
✓ One-way (cannot reverse)
✓ Fixed size output
✓ Avalanche effect (small change → completely different hash)
```

#### Encoding vs Encryption

| Aspect         | Encoding                | Encryption           |
| -------------- | ----------------------- | -------------------- |
| Purpose        | Data representation     | Data protection      |
| Reversible     | Yes, easily             | Yes, with key        |
| Security       | None                    | High                 |
| Key Required   | No                      | Yes                  |
| Examples       | Base64, URL encode      | AES, RSA             |

---

## 🔧 Technical Details

### Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations, gradients, and glassmorphism
- **Vanilla JavaScript** - No frameworks or dependencies
- **Web Crypto API** - Native hash algorithms
- **localStorage** - Theme, notes, and history persistence
- **Google Fonts** - Inter (UI) & JetBrains Mono (hashes/code)

### Browser Support

| Browser   | Minimum Version | Notes        |
| --------- | --------------- | ------------ |
| Chrome    | 60+             | Full support |
| Firefox   | 55+             | Full support |
| Safari    | 11+             | Full support |
| Edge      | 79+             | Full support |
| Opera     | 47+             | Full support |

### Performance

- **Small text** (< 1KB): Instant
- **Medium text** (1-100KB): < 1 second
- **Large text** (100KB-10MB): 1-5 seconds
- **Wordlists** (100K lines): 10-30 seconds
- **Wordlists** (1M+ lines): 1-5 minutes

---

## 🎯 Use Cases

### For Developers

- Debug Base64 encoded data
- URL encode API parameters
- Create data URLs for images
- Inspect JWT tokens
- Test password strength
- HTML escape user input
- Take development notes

### For Security Researchers

- Analyze hash algorithms
- Crack weak hashes (authorized)
- Test encoding bypasses
- Learn cryptography basics
- Decode obfuscated data
- Document findings in notepad

### For Students

- Learn hash functions
- Understand encodings
- Practice cryptography
- Explore classical ciphers
- Study web security
- Take study notes

### For Everyone

- Generate checksums
- Create secret messages (ROT13)
- Convert text formats
- Decode QR code data
- Learn Morse code
- Keep personal notes

---

## 🚧 Roadmap

### Completed Features ✅

- [x] Hash Analyzer tool
- [x] Integrated Notepad
- [x] File upload for hashes
- [x] Complete UI/UX redesign (v2.5.0)
- [x] Terms & Notes consent dialog
- [x] Full history system (Generate, Crack, Analyze, Encode/Decode)
- [x] Output download as .txt
- [x] Clear input buttons
- [x] Confirm delete/clear modals
- [x] Correct item targeting for history Restore, Copy and Delete (v2.5.5)

### Planned Features

- [ ] More cipher types (Vigenère, Playfair)
- [ ] File hash generation (drag & drop)
- [ ] Batch hash generation for multiple inputs
- [ ] Hash comparison tool
- [ ] Export/Import history
- [ ] Custom wordlist builder
- [ ] Note export/import
- [ ] Note categories/tags

### Known Limitations

- Base32/58/62/85/91 implementations are basic
- Large files (100MB+) may cause slowdown
- No GPU acceleration for hash cracking
- Punycode implementation is simplified
- No HMAC support yet
- Notes limited to browser storage

---

## 🤝 Contributing

Contributions are welcome! Here's how:

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Test on multiple browsers
- Update documentation
- Add comments for complex logic
- Ensure mobile responsiveness

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New encoding/decoding methods
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🌍 Translations
- 📱 Mobile improvements

---

## 📝 License

This project is licensed under the MIT License - see the [MIT License](LICENSE) file for details.

---

## ⚠️ Disclaimer

### Legal Notice

This tool is provided for **educational and authorized security testing purposes only**.

#### You must:

- Only test systems you own or have explicit permission to test
- Follow all applicable laws and regulations
- Use responsibly and ethically

#### You must not:

- Attempt unauthorized access to systems
- Use for illegal activities
- Crack hashes of others without permission
- Violate any laws or regulations

**The authors are not responsible for misuse of this tool.**

---

## 💡 FAQ

### Q: Is my data safe?

**A:** Yes! Everything runs in your browser. No data is sent to any server.

### Q: Can I use this offline?

**A:** After the first load, yes! All assets are cached.

### Q: Are the hashes secure?

**A:** SHA-256, SHA-384, and SHA-512 are secure. MD5 and SHA-1 are deprecated.

### Q: How fast is wordlist checking?

**A:** Approximately 300-500 hashes per second, depending on algorithm and browser.

### Q: Can I add my own encoding method?

**A:** Yes! Fork the repo and add your implementation to `encrypt.js`.

### Q: Does encoding provide security?

**A:** No! Encoding is for data representation, not security. Use encryption for security.

### Q: Is this tool legal to use?

**A:** Yes, for testing your own systems. Unauthorized access is illegal.

### Q: Are my notes synced across devices?

**A:** No, notes are stored locally in your browser's localStorage.

### Q: Can I export my notes?

**A:** Currently no, but this feature is planned for a future update.

---

## 📞 Contact & Support

## 👥 Authors

**Abdur Rahman**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github)](https://github.com/abdurrahman101bd)
[![Gmail](https://img.shields.io/badge/Email-abdurrahman101bd@gmail.com-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abdurrahman101bd@gmail.com)

## 📞 Contact

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/abdurrahman101bd)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abdurrahman101bd)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/abdurrahman101b)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/abdurrahman101bd)

---

## 🙏 Acknowledgments

### Resources & Inspiration

- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference
- [OWASP](https://owasp.org/) - Security best practices
- [CyberChef](https://gchq.github.io/CyberChef/) - Inspiration for encoding tools
- [SecLists](https://github.com/danielmiessler/SecLists) - Wordlist resources

---

<div align="center">

### Made with ❤️ by Abdur Rahman

**If you find this project useful, please consider giving it a ⭐!**

[⬆ Back to Top](#-Hash-Cracker)

</div>
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">