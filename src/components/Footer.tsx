import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/40">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                                <GraduationCap className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                HomeSchool
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Interactive learning built for the NCTB syllabus with clear progress tracking for students and parents.
                        </p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                                <a href="mailto:support@homeschool.bd" className="hover:text-primary">
                                    support@homeschool.bd
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                <span>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">Platform</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/courses" className="hover:text-primary">Courses</Link>
                            <Link to="/dashboard" className="hover:text-primary">Student Dashboard</Link>
                            <Link to="/parent" className="hover:text-primary">Parent View</Link>
                            <Link to="/help" className="hover:text-primary">Help Center</Link>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">Company</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/about" className="hover:text-primary">About</Link>
                            <Link to="/features" className="hover:text-primary">Features</Link>
                            <Link to="/pricing" className="hover:text-primary">Pricing</Link>
                            <Link to="/contact" className="hover:text-primary">Contact</Link>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">Legal</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
                    <p>&copy; 2025 HomeSchool. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hover:text-primary">Privacy</Link>
                        <Link to="/terms" className="hover:text-primary">Terms</Link>
                        <Link to="/contact" className="hover:text-primary">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
