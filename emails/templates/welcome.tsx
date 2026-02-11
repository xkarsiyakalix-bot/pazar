import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
    username?: string;
    userEmail?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const WelcomeEmail = ({
    username = 'Kullanıcı',
    userEmail = 'user@example.com',
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>ExVitrin'e Hoş Geldiniz! 🎉</Preview>
        <Body style={main}>
            <Container style={container}>
                {/* Logo */}
                <Section style={logoSection}>
                    <Img
                        src={`${baseUrl}/logo.png`}
                        width="150"
                        height="50"
                        alt="ExVitrin"
                        style={logo}
                    />
                </Section>

                {/* Hero Section */}
                <Section style={heroSection}>
                    <Heading style={h1}>Hoş Geldiniz! 🎉</Heading>
                    <Text style={text}>
                        Merhaba <strong>{username}</strong>,
                    </Text>
                    <Text style={text}>
                        ExVitrin ailesine katıldığınız için çok mutluyuz! Türkiye'nin en büyük
                        ilan pazaryerinde alışverişe başlamak için hazırsınız.
                    </Text>
                </Section>

                {/* Features Section */}
                <Section style={featuresSection}>
                    <table style={featureTable}>
                        <tr>
                            <td style={featureIcon}>📝</td>
                            <td>
                                <Text style={featureTitle}>Ücretsiz İlan Verin</Text>
                                <Text style={featureText}>
                                    Sınırsız ilan yayınlayın ve binlerce alıcıya ulaşın
                                </Text>
                            </td>
                        </tr>
                        <tr>
                            <td style={featureIcon}>🔍</td>
                            <td>
                                <Text style={featureTitle}>Kolayca Arayın</Text>
                                <Text style={featureText}>
                                    Gelişmiş filtrelerle aradığınızı hızlıca bulun
                                </Text>
                            </td>
                        </tr>
                        <tr>
                            <td style={featureIcon}>💬</td>
                            <td>
                                <Text style={featureTitle}>Güvenli Mesajlaşma</Text>
                                <Text style={featureText}>
                                    Satıcılarla doğrudan ve güvenli bir şekilde iletişime geçin
                                </Text>
                            </td>
                        </tr>
                    </table>
                </Section>

                {/* CTA Button */}
                <Section style={buttonSection}>
                    <Button style={button} href={`${baseUrl}/add-listing`}>
                        İlk İlanınızı Verin
                    </Button>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Bu e-postayı {userEmail} adresine gönderiyoruz çünkü ExVitrin'e
                        kaydoldunuz.
                    </Text>
                    <Text style={footerLinks}>
                        <Link href={`${baseUrl}/help`} style={link}>
                            Yardım Merkezi
                        </Link>
                        {' • '}
                        <Link href={`${baseUrl}/privacy`} style={link}>
                            Gizlilik
                        </Link>
                        {' • '}
                        <Link href={`${baseUrl}/terms`} style={link}>
                            Şartlar
                        </Link>
                    </Text>
                    <Text style={copyright}>
                        © 2026 ExVitrin. Tüm hakları saklıdır.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};

const logoSection = {
    padding: '32px 20px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto',
};

const heroSection = {
    padding: '0 48px',
    textAlign: 'center' as const,
};

const h1 = {
    color: '#1f2937',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    textAlign: 'center' as const,
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
    marginBottom: '16px',
};

const featuresSection = {
    padding: '32px 48px',
};

const featureTable = {
    width: '100%',
    borderCollapse: 'collapse' as const,
};

const featureIcon = {
    fontSize: '32px',
    paddingRight: '16px',
    verticalAlign: 'top' as const,
    width: '50px',
};

const featureTitle = {
    color: '#1f2937',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '8px 0 4px 0',
};

const featureText = {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 24px 0',
};

const buttonSection = {
    padding: '32px 48px',
    textAlign: 'center' as const,
};

const button = {
    backgroundColor: '#dc2626',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '16px 0',
};

const footer = {
    padding: '0 48px',
    textAlign: 'center' as const,
};

const footerText = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: '16px',
};

const footerLinks = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: '8px',
};

const link = {
    color: '#dc2626',
    textDecoration: 'underline',
};

const copyright = {
    color: '#9ca3af',
    fontSize: '12px',
    lineHeight: '16px',
};
