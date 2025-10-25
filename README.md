<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

# 🔐 Hash-Cracker

<p><img src="https://komarev.com/ghpvc/?username=abdurrahman101bd" alt="Profile Views"> <img src="https://custom-icon-badges.herokuapp.com/badge/Repo-blue.svg?logo=repo" alt="Repository Count Badge">
<img src="https://custom-icon-badges.herokuapp.com/badge/Star-yellow.svg?logo=star" alt="Stars Badge">
<img src="https://custom-icon-badges.herokuapp.com/badge/Issue-red.svg?logo=issue" alt="Issue Badge">
<img src="https://custom-icon-badges.herokuapp.com/badge/Fork-orange.svg?logo=fork" alt="Fork Badge">
<img src="https://custom-icon-badges.herokuapp.com/badge/Commit-green.svg?logo=commit" alt="Commit Badge">
<img src="https://custom-icon-badges.herokuapp.com/badge/Pull Request-purple.svg?logo=pr" alt="Pull Badge"></p>

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/abdurrahman101bd/Hash-Cracker)
![GitHub issues](https://img.shields.io/github/issues-raw/abdurrahman101bd/Hash-Cracker)
![GitHub stars](https://img.shields.io/github/stars/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/abdurrahman101bd/Hash-Cracker)
![GitHub issues](https://img.shields.io/github/issues/abdurrahman101bd/Hash-Cracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/abdurrahman101bd/Hash-Cracker)

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)


A comprehensive web-based security and cryptography toolkit featuring hash generation, verification, and 40+ encoding/decoding methods. All operations are performed locally in your browser - no data is ever sent to any server.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 🌟 Features

### 🔐 Hash Checker

- **Generate Hashes** - Create cryptographic hashes from any text
- **Verify Hashes** - Crack hashes using wordlist-based dictionary attacks
- **Multiple Algorithms** - MD5, SHA-1, SHA-256, SHA-384, SHA-512
- **History Tracking** - Separate history for hash generation and verification
- **Performance** - Batch processing with progress tracking for large wordlists

### 🔄 Encode/Decode Tool

- **40+ Encoding Methods** - Comprehensive encoding/decoding toolkit
- **Real-time Processing** - Instant encode/decode operations
- **Category Filtering** - Organized by Base, ASCII, URL, Data, Cipher, and Utilities
- **Search Functionality** - Quick tool lookup
- **Swap Feature** - Easily exchange input and output

### 🎨 User Interface

- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Modern UI with engaging transitions
- **Mobile Menu** - Collapsible navigation for small screens
- **Floating TOC** - Easy navigation in documentation

---

## 🚀 Quick Start

1. Visit the live demo
2. Select your tool (Hash Checker or Encoder)
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

#### Verify Hash (Crack)

1. Paste target hash in hex format
2. Select the correct algorithm
3. Upload a wordlist file (.txt)
4. Click "Start Check"
5. View results - match found or not found

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

### Theme System

- **Dark Mode** - Default elegant dark theme
- **Light Mode** - Clean light alternative
- **Persistent** - Preference saved in localStorage
- **Smooth Transition** - Animated theme switching

### Responsive Design

- **Mobile First** - Optimized for all screen sizes
- **Breakpoints:**
  - Mobile: < 500px
  - Tablet: 500px - 768px
  - Desktop: > 768px
- **Touch Friendly** - Large buttons and easy navigation

### Animations

- Fade-in on page load
- Smooth scroll navigation
- Hover effects on cards
- Progress bar for reading
- Floating Table of Contents

---

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

## 🚀 Demo

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge&logo=google-chrome)](https://abdurrahman101bd.github.io/Hash-Cracker)

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
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No frameworks or dependencies
- **Web Crypto API** - Native hash algorithms
- **localStorage** - Theme and history persistence

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

### For Security Researchers

- Analyze hash algorithms
- Crack weak hashes (authorized)
- Test encoding bypasses
- Learn cryptography basics
- Decode obfuscated data

### For Students

- Learn hash functions
- Understand encodings
- Practice cryptography
- Explore classical ciphers
- Study web security

### For Everyone

- Generate checksums
- Create secret messages (ROT13)
- Convert text formats
- Decode QR code data
- Learn Morse code

---

## 🚧 Roadmap

### Planned Features

- [ ] Additional hash algorithms (BLAKE2, SHA-3)
- [ ] More cipher types (Vigenère, Playfair)
- [ ] File hash generation
- [ ] Batch processing
- [ ] Hash comparison tool
- [ ] Rainbow table integration
- [ ] Export/Import history
- [ ] Custom wordlist builder
- [ ] API documentation
- [ ] Browser extension

### Known Limitations

- Base32/58/62/85/91 implementations are basic
- Large files (100MB+) may cause slowdown
- No GPU acceleration for hash cracking
- Punycode implementation is simplified
- No HMAC support yet

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

### Get Help

- 📖 Read the [Documentation](docs.html)
- 🐛 [Report Issues](https://github.com/yourusername/arzone-security-toolkit/issues)
- 💬 [Discussions](https://github.com/abdurrahman101bd/Hash-Cracker/discussions)
- ⭐ Star this repo if you find it useful!

---

## 🙏 Acknowledgments

### Resources & Inspiration

- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference
- [OWASP](https://owasp.org/) - Security best practices
- [CyberChef](https://gchq.github.io/CyberChef/) - Inspiration for encoding tools
- [SecLists](https://github.com/danielmiessler/SecLists) - Wordlist resources

### Special Thanks

- All contributors who help improve this project
- The open-source community
- Everyone who provides feedback and suggestions

---

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub Forks](https://img.shields.io/github/forks/abdurrahman101bd/Hash-Cracker?style=social)
![GitHub Issues](https://img.shields.io/github/issues/abdurrahman101bd/Hash-Cracker)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/abdurrahman101bd/Hash-Cracker)

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=abdurrahman101bd/Hash-Cracker&type=Date)](https://star-history.com/#abdurrahman101bd/Hash-Cracker&Date)


<div align="center">

### Made with ❤️ by Abdur Rahman

**If you find this project useful, please consider giving it a ⭐!**

[⬆ Back to Top](#-Hash-Cracker)

</div>
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">
