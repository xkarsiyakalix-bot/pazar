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
    Hr,
} from '@react-email/components';
import * as React from 'react';

interface ListingPublishedEmailProps {
    username?: string;
    listingTitle?: string;
    listingUrl?: string;
    listingImage?: string;
    price?: string;
    category?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

export const ListingPublishedEmail = ({
    username = 'Kullanıcı',
    listingTitle = 'İlanınız',
    listingUrl = '#',
    listingImage = '',
    price = '0',
    category = 'Genel',
}: ListingPublishedEmailProps) => (
    <Html>
        <Head />
        <Preview>İlanınız Yayında! 🎉</Preview>
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
                    <Heading style={h1}>İlanınız Yayında! 🎉</Heading>
                    <Text style={text}>
                        Merhaba <strong>{username}</strong>,
                    </Text>
                    <Text style={text}>
                        İlanınız başarıyla yayınlandı ve binlerce alıcı tarafından
                        görüntülenmeye başladı!
                    </Text>
                </Section>

                {/* Listing Card */}
                <Section style={listingCard}>
                    {listingImage && (
                        <Img
                            src={listingImage}
                            alt={listingTitle}
                            style={listingImage}
                            width="100%"
                            height="200"
                        />
                    )}
                    <div style={listingContent}>
                        <Text style={listingCategory}>{category}</Text>
                        <Heading style={listingTitle}>{listingTitle}</Heading>
                        <Text style={listingPrice}>{price} TL</Text>
                    </div>
                </Section>

                {/* CTA Buttons */}
                <Section style={buttonSection}>
                    <Button style={primaryButton} href={listingUrl}>
                        İlanı Görüntüle
                    </Button>
                    <Button style={secondaryButton} href={`${baseUrl}/my-listings`}>
                        Tüm İlanlarım
                    </Button>
                </Section>

                <Hr style={divider} />

                {/* Tips Section */}
                <Section style={tipsSection}>
                    <Heading style={h2}>💡 İlanınızı Öne Çıkarın</Heading>
                    <table style={tipTable}>
                        <tr>
                            <td style={tipIcon}>⭐</td>
                            <td>
                                <Text style={tipText}>
                                    <strong>Premium Paketler:</strong> İlanınızı öne çıkararak daha
                                    fazla görüntülenme sağlayın
                                </Text>
                            </td>
                        </tr>
                        <tr>
                            <td style={tipIcon}>📸</td>
                            <td>
                                <Text style={tipText}>
                                    <strong>Kaliteli Fotoğraflar:</strong> Net ve iyi aydınlatılmış
                                    görseller kullanın
                                </Text>
                            </td>
                        </tr>
                        <tr>
                            <td style={tipIcon}>✍️</td>
                            <td>
                                <Text style={tipText}>
                                    <strong>Detaylı Açıklama:</strong> Ürününüzü eksiksiz tanıtın
                                </Text>
                            </td>
                        </tr>
                    </table>
                </Section>

                {/* Footer */}
                <Section style={footer}>
                    <Text style={footerText}>
                        İlanınızı yönetmek veya düzenlemek için{' '}
                        <Link href={`${baseUrl}/my-listings`} style={link}>
                            İlanlarım
                        </Link>{' '}
                        sayfasını ziyaret edebilirsiniz.
                    </Text>
                    <Text style={footerLinks}>
                        <Link href={`${baseUrl}/help`} style={link}>
                            Yardım
                        </Link>
                        {' • '}
                        <Link href={`${baseUrl}/pricing`} style={link}>
                            Premium Paketler
                        </Link>
                        {' • '}
                        <Link href={`${baseUrl}/settings`} style={link}>
                            Ayarlar
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

export default ListingPublishedEmail;

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

const h2 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '24px 0 16px 0',
    textAlign: 'center' as const,
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
    marginBottom: '16px',
};

const listingCard = {
    margin: '32px 48px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
};

const listingImage = {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
};

const listingContent = {
    padding: '24px',
};

const listingCategory = {
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 8px 0',
};

const listingTitle = {
    color: '#1f2937',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
};

const listingPrice = {
    color: '#059669',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
};

const buttonSection = {
    padding: '0 48px',
    textAlign: 'center' as const,
};

const primaryButton = {
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
    marginBottom: '12px',
};

const secondaryButton = {
    backgroundColor: '#ffffff',
    border: '2px solid #dc2626',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '100%',
    padding: '14px 0',
};

const divider = {
    borderColor: '#e5e7eb',
    margin: '32px 48px',
};

const tipsSection = {
    padding: '0 48px',
};

const tipTable = {
    width: '100%',
    marginTop: '16px',
};

const tipIcon = {
    fontSize: '24px',
    paddingRight: '12px',
    verticalAlign: 'top' as const,
    width: '40px',
};

const tipText = {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 0 16px 0',
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
