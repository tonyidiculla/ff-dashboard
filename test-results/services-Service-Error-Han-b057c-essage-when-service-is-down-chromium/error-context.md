# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img "Furfield Logo" [ref=e7]
        - heading "FURFIELD" [level=1] [ref=e8]
      - paragraph [ref=e9]: Welcome back
      - paragraph [ref=e10]: Please sign in to continue
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "Email" [ref=e14]:
          - /placeholder: tony@fusionduotech.com
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - textbox "Password" [ref=e17]:
          - /placeholder: ••••••••
      - button "Sign in" [ref=e18]
      - paragraph [ref=e20]:
        - text: Don't have an account?
        - link "Sign up" [ref=e21] [cursor=pointer]:
          - /url: /register
    - paragraph [ref=e23]: Unified authentication for all FURFIELD applications
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e33]
```