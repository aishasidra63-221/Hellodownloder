export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-3">
              Tik<span className="text-primary">Down</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fast & free TikTok downloader. No watermark. No login.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Tools</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">TikTok Downloader</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">MP3 Extractor</a></li>
              <li><a href="/" className="hover:text-primary transition-colors">Photo Downloader</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Info</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/dmca" className="hover:text-primary transition-colors">DMCA</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} TikDown. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with TikTok or ByteDance. For personal use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
