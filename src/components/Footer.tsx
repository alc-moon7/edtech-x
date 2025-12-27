export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/50 py-12">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                    &copy; 2025 HomeSchool. All rights reserved.
                </p>
                <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary">Privacy Policy</a>
                    <a href="#" className="hover:text-primary">Terms of Service</a>
                    <a href="#" className="hover:text-primary">Contact Support</a>
                </div>
            </div>
        </footer>
    );
}
