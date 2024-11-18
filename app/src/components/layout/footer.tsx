export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container py-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                TimeTrack
              </span>
            </h3>
            <p className="text-sm text-gray-400">
              Streamline your project management and collaboration effortlessly.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold">Product</h4>
            <ul className="mt-2 space-y-2">
              {["Features", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="mt-4 space-y-2">
              {["About",  "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2">
              {["Privacy", "Terms"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-6">
          <p className="text-sm text-gray-400">
            © {currentYear} TimeTrack. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white"
            >
              {/* Replace with an actual Facebook Icon */}
              Facebook
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 hover:text-white"
            >
              {/* Replace with an actual Twitter Icon */}
              Twitter
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white"
            >
              {/* Replace with an actual LinkedIn Icon */}
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
