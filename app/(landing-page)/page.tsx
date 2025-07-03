import { FeatureGrid } from "@/components/features";
import { Hero } from "@/components/hero";
import { PricingGrid } from "@/components/pricing";
import { stackServerApp } from "@/stack";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ComponentIcon, Users } from "lucide-react";

export default async function IndexPage() {
  const project = await stackServerApp.getProject();
  if (!project.config.clientTeamCreationEnabled) {
    return (
      <div className="w-full min-h-96 flex items-center justify-center">
        <div className="max-w-xl gap-4">
          <p className="font-bold text-xl">Setup Required</p>
          <p className="">
            {
              "To start using this project, please enable client-side team creation in the Stack Auth dashboard (Project > Team Settings). This message will disappear once the feature is enabled."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero
        capsuleText="Temporary Email Service"
        capsuleLink="https://rowdymail.xyz"
        title="Rowdy Mail"
        subtitle="Professional temporary email service for testing, verification, and privacy. Generate disposable emails instantly with our powerful API."
        primaryCtaText="Get Started"
        primaryCtaLink={stackServerApp.urls.signUp}
        secondaryCtaText="GitHub"
        secondaryCtaLink="https://github.com/rowdy-raedon/multi-tenant-starter-template"
        credits={
          <>
            Built with ❤️ by{" "}
            <a
              href="https://rowdymail.xyz"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Rowdy Mail
            </a>
          </>
        }
      />

      <div id="features" />
      <FeatureGrid
        title="Features"
        subtitle="Powerful temporary email capabilities for all your needs."
        items={[
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            ),
            title: "Instant Email Generation",
            description:
              "Generate temporary email addresses instantly with our Mailsac API integration.",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            ),
            title: "Real-time Messages",
            description:
              "Receive and view messages instantly with our real-time dashboard interface.",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="m7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            ),
            title: "Privacy & Security",
            description:
              "Protect your real email address with secure temporary alternatives.",
          },
          {
            icon: <Users className="h-12 w-12" />,
            title: "Team Management",
            description: "Multi-tenant support with team-based email organization.",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="m22 2-5 10-3-3-5 5"/>
              </svg>
            ),
            title: "API Integration",
            description: "Powerful REST API for seamless integration with your applications.",
          },
          {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12">
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            ),
            title: "Free to Use",
            description: "Start with our free tier and scale as your needs grow.",
          },
        ]}
      />

      <div id="pricing" />
      <PricingGrid
        title="Pricing"
        subtitle="Simple, transparent pricing for temporary email services."
        items={[
          {
            title: "Free",
            price: "$0",
            description: "Perfect for personal use and testing.",
            features: [
              "50 temporary emails per month",
              "7-day email retention",
              "Basic API access",
              "Community support",
              "No credit card required",
            ],
            buttonText: "Get Started",
            buttonHref: stackServerApp.urls.signUp,
          },
          {
            title: "Pro",
            price: "$9",
            description: "Ideal for developers and small teams.",
            features: [
              "500 temporary emails per month",
              "30-day email retention",
              "Full API access",
              "Priority support",
              "Team management",
            ],
            buttonText: "Upgrade to Pro",
            isPopular: true,
            buttonHref: stackServerApp.urls.signUp,
          },
          {
            title: "Enterprise",
            price: "Custom",
            description: "For large organizations and high-volume usage.",
            features: [
              "Unlimited temporary emails",
              "Custom retention periods",
              "Dedicated API endpoints",
              "24/7 priority support",
              "Custom integrations",
            ],
            buttonText: "Contact Sales",
            buttonHref: stackServerApp.urls.signUp,
          },
        ]}
      />
    </>
  );
}
