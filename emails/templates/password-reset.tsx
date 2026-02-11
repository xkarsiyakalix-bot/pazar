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

interface PasswordResetEmailProps {
    username?: string;
    resetUrl?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const PasswordResetEmail = ({
    username = 'Kullanıcı',
    resetUrl = '#',
}: PasswordResetEmailProps) => (
    <Html>
        <Head />
        <Preview>Şifre Sıfırlama Talebi</Preview>
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

                {/* Hero */}
                <Section style={heroSection}>
                    <div style={iconContainer}>
                        <Text style={lockIcon}>🔒</Text>
                    </div>
                    <Heading style={h1}>Şifre Sıfırlama</Heading>
                    <Text style={text}>
                        Merhaba <strong>{username}</strong>,
                    </Text>
                    <Text style={text}>
                        Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Şifrenizi
                        sıfırlamak için aşağıdaki butona tıklayın.
                    </Text>
                </Section>

                {/* CTA Button */}
                <Section style={buttonSection}>
                    <Button style={button} href={resetUrl}>
                        Şifremi Sıfırla
                    </Button>
                </Section>

                {/* Warning Box */}
                <Section style={warningBox}>
                    <Text style={warningText}>
                        ⚠️ <strong>Önemli:</strong> Bu link 1 saat içinde geçerliliğini
                        yitirecektir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu
                        e-postayı görmezden gelebilirsiniz.
                    </Text>
                </Section>

                {/* Alternative Link */}
                <Section style={alternativeSection}>
                    <Text style={alternativeText}>
                        Buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayın:
                    </Text>
                    <Text style={linkText}>{resetUrl}</Text>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        Güvenlik nedeniyle, şifrenizi asla kimseyle paylaşmayın.
                    </Text>
                    <Text style={footerLinks}>
                        <Link href={`${baseUrl}/help`} style={link}>
                            Yardım Merkezi
                        </Link>
                        {' • '}
                        <Link href={`${baseUrl}/contact`} style={link}>
                            İletişim
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

export default PasswordResetEmail;

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

const iconContainer = {
    margin: '0 auto 24px',
    width: '80px',
    height: '80px',
    backgroundColor: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const lockIcon = {
    fontSize: '40px',
    margin: '0',
};

const h1 = {
    color: '#1f2937',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '24px 0',
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

const warningBox = {
    margin: '0 48px',
    padding: '16px',
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '8px',
};

const warningText = {
    color: '#92400e',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0',
};

const alternativeSection = {
    padding: '32px 48px',
    textAlign: 'center' as const,
};

const alternativeText = {
    color: '#6b7280',
    fontSize: '12px',
    lineHeight: '16px',
    marginBottom: '8px',
};

const linkText = {
    color: '#dc2626',
    fontSize: '12px',
    lineHeight: '16px',
    wordBreak: 'break-all' as const,
};

const footer = {
    padding: '32px 48px 0',
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
