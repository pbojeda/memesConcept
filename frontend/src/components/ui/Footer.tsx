import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8 md:order-2">
                        <Link href="/privacy" className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors">
                            Terms of Service
                        </Link>
                        <a href="mailto:contact@memesconcept.com" className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors">
                            Contact
                        </a>
                    </div>
                    <div className="md:order-1">
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; {new Date().getFullYear()} memesConcept. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
