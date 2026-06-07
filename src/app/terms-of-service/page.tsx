import LegalPageShell, { Section } from "../components/LegalPageShell";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="6 June 2026">
      <p>
        Welcome to Car Bazaar Kenya. These Terms of Service (&quot;Terms&quot;) govern your use of our online vehicle
        marketplace. By creating an account or using our services, you agree to these Terms and our Privacy Policy.
      </p>

      <Section title="1. About Car Bazaar">
        <p>
          Car Bazaar is a platform that connects vehicle buyers and sellers in Kenya. We facilitate listings and
          enquiries but are not a party to any sale transaction between users. Car Bazaar does not guarantee the
          condition, ownership, or legality of any vehicle listed.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <p>
          You must be at least 18 years old and capable of entering a binding contract under Kenyan law. Sellers must
          have lawful authority to list the vehicles they advertise. You are responsible for ensuring your account
          credentials remain confidential.
        </p>
      </Section>

      <Section title="3. Seller Obligations">
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate, complete, and up-to-date listing information including price, mileage, and condition.</li>
          <li>Upload only photographs of the actual vehicle being offered for sale.</li>
          <li>Respond promptly and honestly to buyer enquiries.</li>
          <li>Comply with NTSA requirements, transfer procedures, and all applicable Kenyan motor vehicle regulations.</li>
          <li>Remove or mark as sold listings that are no longer available.</li>
        </ul>
      </Section>

      <Section title="4. Buyer Obligations">
        <ul className="list-disc pl-6 space-y-2">
          <li>Conduct your own due diligence including physical inspection and verification of logbook ownership.</li>
          <li>Not use Car Bazaar for fraudulent enquiries, harassment, or spam.</li>
          <li>Understand that listed prices are set by sellers and may be negotiable directly with them.</li>
        </ul>
      </Section>

      <Section title="5. Prohibited Conduct">
        <p>Users must not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>List stolen, encumbered, or illegally imported vehicles.</li>
          <li>Post misleading descriptions, fake photos, or bait-and-switch listings.</li>
          <li>Impersonate another person or misrepresent vehicle ownership.</li>
          <li>Attempt to circumvent platform safety features or scrape data without permission.</li>
          <li>Use the platform for money laundering or other unlawful activity.</li>
        </ul>
      </Section>

      <Section title="6. Fees & Payments">
        <p>
          Basic listing and browsing are currently free. Car Bazaar may introduce premium features or fees in the
          future with reasonable notice. M-Pesa and other payment integrations are provided for convenience; any
          transaction fees are disclosed at the point of use.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          Car Bazaar is provided &quot;as is&quot;. To the fullest extent permitted by Kenyan law, we are not liable
          for disputes between buyers and sellers, vehicle defects, failed transactions, or losses arising from
          reliance on listing information. Our total liability to you shall not exceed the fees you paid to us in the
          preceding 12 months (if any).
        </p>
      </Section>

      <Section title="8. Account Suspension">
        <p>
          We may suspend or terminate accounts that violate these Terms, receive credible fraud reports, or pose a risk
          to other users. You may delete your account by contacting support; some records may be retained as described
          in our Privacy Policy.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by the laws of the Republic of Kenya. Disputes shall be subject to the exclusive
          jurisdiction of the courts of Kenya, without prejudice to your rights under the Consumer Protection Act,
          2012.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these Terms? Reach us at{" "}
          <a href="mailto:legal@carbazaar.co.ke" className="text-kairo-gold hover:underline">
            legal@carbazaar.co.ke
          </a>{" "}
          or through our{" "}
          <a href="/contact" className="text-kairo-gold hover:underline">
            Contact page
          </a>
          .
        </p>
      </Section>
    </LegalPageShell>
  );
}
