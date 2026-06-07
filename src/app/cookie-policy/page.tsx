import LegalPageShell, { Section } from "../components/LegalPageShell";

export default function CookiePolicyPage() {
  return (
    <LegalPageShell title="Cookie Policy" lastUpdated="6 June 2026">
      <p>
        This Cookie Policy explains how Car Bazaar Kenya uses cookies and similar technologies when you visit our
        website. By continuing to use Car Bazaar, you consent to our use of essential cookies as described below.
      </p>

      <Section title="1. What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a website. They help the site remember
          your preferences, keep you logged in, and understand how the site is used.
        </p>
      </Section>

      <Section title="2. Cookies We Use">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-kairo-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-kairo-surface text-kairo-ink">
                <th className="text-left p-3 border-b border-kairo-border">Cookie</th>
                <th className="text-left p-3 border-b border-kairo-border">Purpose</th>
                <th className="text-left p-3 border-b border-kairo-border">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-kairo-border">
                <td className="p-3 font-mono text-kairo-gold">carbazaar_token</td>
                <td className="p-3">Keeps you signed in securely (HTTP-only session cookie)</td>
                <td className="p-3">Session / up to 7 days</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-kairo-gold">Analytics (optional)</td>
                <td className="p-3">Helps us understand page views and improve the marketplace experience</td>
                <td className="p-3">Up to 12 months</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Essential vs Optional Cookies">
        <p>
          <strong className="text-kairo-ink">Essential cookies</strong> are required for the site to function — for
          example, keeping you logged in so you can manage listings or send enquiries. These cannot be disabled while
          using authenticated features.
        </p>
        <p>
          <strong className="text-kairo-ink">Optional analytics cookies</strong> help us improve Car Bazaar. Where
          required by law, we will ask for your consent before setting non-essential cookies.
        </p>
      </Section>

      <Section title="4. Managing Cookies">
        <p>
          You can control cookies through your browser settings. Blocking essential cookies may prevent you from
          logging in or using seller dashboard features. To clear your session, use the Logout button or delete cookies
          for carbazaar.co.ke in your browser.
        </p>
      </Section>

      <Section title="5. Third-Party Cookies">
        <p>
          We may embed content from third parties (e.g. vehicle image hosts). These services may set their own cookies
          governed by their respective policies. We do not control third-party cookies.
        </p>
      </Section>

      <Section title="6. Updates & Contact">
        <p>
          We may update this policy from time to time. Continued use of the site after changes constitutes acceptance.
          Questions? Email{" "}
          <a href="mailto:privacy@carbazaar.co.ke" className="text-kairo-gold hover:underline">
            privacy@carbazaar.co.ke
          </a>
          .
        </p>
      </Section>
    </LegalPageShell>
  );
}
