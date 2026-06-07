import LegalPageShell, { Section } from "../components/LegalPageShell";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="6 June 2026">
      <p>
        Car Bazaar Kenya (&quot;Car Bazaar&quot;, &quot;we&quot;, &quot;us&quot;) operates an online marketplace connecting
        buyers and sellers of motor vehicles across Kenya. This Privacy Policy explains how we collect, use, store,
        and protect your personal information when you use our website and services.
      </p>

      <Section title="1. Information We Collect">
        <p>
          <strong className="text-kairo-ink">Account information:</strong> When you register, we collect your name,
          email address, phone number (optional), password (stored securely hashed), and account role (Buyer or Seller).
        </p>
        <p>
          <strong className="text-kairo-ink">Listing information:</strong> Sellers provide vehicle details including
          make, model, year, price, mileage, location, photographs, and contact information for listings.
        </p>
        <p>
          <strong className="text-kairo-ink">Enquiry data:</strong> When you contact a seller, we collect your name,
          email, phone number, and message content.
        </p>
        <p>
          <strong className="text-kairo-ink">Technical data:</strong> We collect session cookies for authentication,
          and may collect anonymised usage data to improve our platform.
        </p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc pl-6 space-y-2">
          <li>To create and manage your account and authenticate your sessions.</li>
          <li>To display vehicle listings and facilitate buyer–seller enquiries.</li>
          <li>To send transactional emails such as password reset links.</li>
          <li>To comply with applicable Kenyan laws and respond to lawful requests.</li>
          <li>To detect and prevent fraud, abuse, or misleading listings.</li>
        </ul>
      </Section>

      <Section title="3. Data Sharing">
        <p>
          We do not sell your personal data. Enquiry details are shared with the relevant seller so they can respond
          to you. We may share data with service providers (e.g. email delivery, hosting) who process data on our
          behalf under confidentiality obligations. We may disclose information where required by Kenyan law or a
          court order.
        </p>
      </Section>

      <Section title="4. Data Retention">
        <p>
          Account data is retained while your account is active. Listing and enquiry records may be retained for a
          reasonable period after deletion for dispute resolution and legal compliance. Password reset tokens expire
          after one hour and are then cleared.
        </p>
      </Section>

      <Section title="5. Your Rights">
        <p>
          Under the Kenya Data Protection Act, 2019, you have the right to access, correct, or request deletion of
          your personal data. You may also object to certain processing or lodge a complaint with the Office of the
          Data Protection Commissioner. Contact us at privacy@carbazaar.co.ke to exercise these rights.
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          We use industry-standard measures including encrypted passwords, secure HTTP-only session cookies, and
          access controls. No method of transmission over the internet is 100% secure; we encourage you to use a
          strong, unique password.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          For privacy-related questions, contact us at{" "}
          <a href="mailto:privacy@carbazaar.co.ke" className="text-kairo-gold hover:underline">
            privacy@carbazaar.co.ke
          </a>{" "}
          or via our{" "}
          <a href="/contact" className="text-kairo-gold hover:underline">
            Contact page
          </a>
          .
        </p>
      </Section>
    </LegalPageShell>
  );
}
