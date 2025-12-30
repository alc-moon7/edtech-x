import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="border-t border-border bg-muted/40">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="HomeSchool" className="h-10 w-auto" loading="lazy" />
                        </Link>
                        <p className="text-sm text-muted-foreground">{t("footer.description")}</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                                <a href="mailto:support@homeschool.bd" className="hover:text-primary">
                                    {t("footer.email")}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                                <span>{t("footer.location")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">{t("footer.platform")}</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/courses" className="hover:text-primary">{t("footer.courses")}</Link>
                            <Link to="/dashboard" className="hover:text-primary">{t("footer.student_dashboard")}</Link>
                            <Link to="/parent" className="hover:text-primary">{t("footer.parent_view")}</Link>
                            <Link to="/help" className="hover:text-primary">{t("footer.help_center")}</Link>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">{t("footer.company")}</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/about" className="hover:text-primary">{t("footer.about")}</Link>
                            <Link to="/pricing" className="hover:text-primary">{t("footer.pricing")}</Link>
                            <Link to="/contact" className="hover:text-primary">{t("footer.contact")}</Link>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-foreground">{t("footer.legal")}</h3>
                        <div className="flex flex-col gap-2 text-muted-foreground">
                            <Link to="/privacy" className="hover:text-primary">{t("footer.privacy_policy")}</Link>
                            <Link to="/terms" className="hover:text-primary">{t("footer.terms")}</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
                    <p>{t("footer.copyright")}</p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hover:text-primary">{t("footer.privacy_policy")}</Link>
                        <Link to="/terms" className="hover:text-primary">{t("footer.terms")}</Link>
                        <Link to="/contact" className="hover:text-primary">{t("footer.contact")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
