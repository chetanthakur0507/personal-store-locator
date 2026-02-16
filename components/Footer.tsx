export default function Footer() {
  return (
    <footer className="border-t border-[#FFCE99] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-gray-500 md:flex-row">
        <p>© 2026 Sahara Mart. All rights reserved.</p>
        <div className="flex gap-4">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
