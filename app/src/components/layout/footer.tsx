export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-secondaryBackground text-foreground border-t border-border">
      <div className="container py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            <span className="bg-clip-text">
              TimeTrack
            </span>
          </h3>
          <p className="text-sm text-gray-400">
            Streamline your project management and collaboration effortlessly.
          </p>
          <p className="text-sm text-gray-400">
            © {currentYear} TimeTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
