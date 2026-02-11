"""
ExVitrin Email Service using Resend
Handles all email communications for the platform
"""

import os
from typing import Optional, Dict, Any
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('RESEND_API_KEY')
        self.base_url = 'https://api.resend.com'
        # Use Resend's onboarding domain for testing (change to your verified domain later)
        self.from_email = 'ExVitrin <onboarding@resend.dev>'
        self.frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        
    def _send_email(self, to: str, subject: str, html: str) -> Dict[str, Any]:
        """
        Send email using Resend API
        """
        if not self.api_key:
            print("Warning: RESEND_API_KEY not set. Email not sent.")
            return {'success': False, 'error': 'API key not configured'}
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'from': self.from_email,
            'to': [to],
            'subject': subject,
            'html': html
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/emails',
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                return {'success': True, 'data': response.json()}
            else:
                return {
                    'success': False,
                    'error': response.json(),
                    'status_code': response.status_code
                }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def send_welcome_email(self, user_email: str, username: str) -> Dict[str, Any]:
        """
        Send welcome email to new users
        """
        subject = "ExVitrin'e Hoş Geldiniz! 🎉"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                            <!-- Logo -->
                            <tr>
                                <td style="padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">ExVitrin</h1>
                                </td>
                            </tr>
                            
                            <!-- Hero -->
                            <tr>
                                <td style="padding: 0 48px; text-align: center;">
                                    <h1 style="color: #1f2937; font-size: 32px; font-weight: bold; margin: 40px 0;">Hoş Geldiniz! 🎉</h1>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        Merhaba <strong>{username}</strong>,
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        ExVitrin ailesine katıldığınız için çok mutluyuz! Türkiye'nin en büyük ilan pazaryerinde alışverişe başlamak için hazırsınız.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Features -->
                            <tr>
                                <td style="padding: 32px 48px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="font-size: 32px; padding-right: 16px; vertical-align: top; width: 50px;">📝</td>
                                            <td>
                                                <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 8px 0 4px 0;">Ücretsiz İlan Verin</p>
                                                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0 0 24px 0;">Sınırsız ilan yayınlayın ve binlerce alıcıya ulaşın</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 32px; padding-right: 16px; vertical-align: top;">🔍</td>
                                            <td>
                                                <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 8px 0 4px 0;">Kolayca Arayın</p>
                                                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0 0 24px 0;">Gelişmiş filtrelerle aradığınızı hızlıca bulun</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="font-size: 32px; padding-right: 16px; vertical-align: top;">💬</td>
                                            <td>
                                                <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 8px 0 4px 0;">Güvenli Mesajlaşma</p>
                                                <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0;">Satıcılarla doğrudan ve güvenli bir şekilde iletişime geçin</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- CTA Button -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center;">
                                    <a href="{self.frontend_url}/add-listing" style="background-color: #dc2626; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; display: inline-block;">
                                        İlk İlanınızı Verin
                                    </a>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px; margin-bottom: 16px;">
                                        Bu e-postayı {user_email} adresine gönderiyoruz çünkü ExVitrin'e kaydoldunuz.
                                    </p>
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px; margin-bottom: 8px;">
                                        <a href="{self.frontend_url}/help" style="color: #dc2626; text-decoration: underline;">Yardım Merkezi</a> •
                                        <a href="{self.frontend_url}/privacy" style="color: #dc2626; text-decoration: underline;">Gizlilik</a> •
                                        <a href="{self.frontend_url}/terms" style="color: #dc2626; text-decoration: underline;">Şartlar</a>
                                    </p>
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px;">
                                        © 2026 ExVitrin. Tüm hakları saklıdır.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, html)
    
    def send_listing_published_email(
        self,
        user_email: str,
        username: str,
        listing_title: str,
        listing_url: str,
        listing_image: Optional[str] = None,
        price: str = "0",
        category: str = "Genel"
    ) -> Dict[str, Any]:
        """
        Send email when a listing is published
        """
        subject = "İlanınız Yayında! 🎉"
        
        image_html = ""
        if listing_image:
            image_html = f'<img src="{listing_image}" alt="{listing_title}" style="width: 100%; height: 200px; object-fit: cover;" />'
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                            <!-- Logo -->
                            <tr>
                                <td style="padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">ExVitrin</h1>
                                </td>
                            </tr>
                            
                            <!-- Hero -->
                            <tr>
                                <td style="padding: 0 48px; text-align: center;">
                                    <h1 style="color: #1f2937; font-size: 32px; font-weight: bold; margin: 40px 0;">İlanınız Yayında! 🎉</h1>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        Merhaba <strong>{username}</strong>,
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        İlanınız başarıyla yayınlandı ve binlerce alıcı tarafından görüntülenmeye başladı!
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Listing Card -->
                            <tr>
                                <td style="padding: 32px 48px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                                        <tr>
                                            <td>
                                                {image_html}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 24px;">
                                                <p style="color: #dc2626; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">{category}</p>
                                                <h2 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 12px 0;">{listing_title}</h2>
                                                <p style="color: #059669; font-size: 24px; font-weight: bold; margin: 0;">{price} TL</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- CTA Buttons -->
                            <tr>
                                <td style="padding: 0 48px 32px; text-align: center;">
                                    <a href="{listing_url}" style="background-color: #dc2626; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; display: inline-block; margin-bottom: 12px; width: 100%; box-sizing: border-box;">
                                        İlanı Görüntüle
                                    </a>
                                    <a href="{self.frontend_url}/my-listings" style="background-color: #ffffff; border: 2px solid #dc2626; border-radius: 8px; color: #dc2626; font-size: 16px; font-weight: bold; text-decoration: none; padding: 14px 32px; display: inline-block; width: 100%; box-sizing: border-box;">
                                        Tüm İlanlarım
                                    </a>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px; margin-bottom: 16px;">
                                        İlanınızı yönetmek veya düzenlemek için <a href="{self.frontend_url}/my-listings" style="color: #dc2626; text-decoration: underline;">İlanlarım</a> sayfasını ziyaret edebilirsiniz.
                                    </p>
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px;">
                                        © 2026 ExVitrin. Tüm hakları saklıdır.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, html)
    
    def send_password_reset_email(
        self,
        user_email: str,
        username: str,
        reset_token: str
    ) -> Dict[str, Any]:
        """
        Send password reset email
        """
        subject = "Şifre Sıfırlama Talebi"
        reset_url = f"{self.frontend_url}/reset-password?token={reset_token}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                            <!-- Logo -->
                            <tr>
                                <td style="padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">ExVitrin</h1>
                                </td>
                            </tr>
                            
                            <!-- Hero -->
                            <tr>
                                <td style="padding: 0 48px; text-align: center;">
                                    <div style="margin: 0 auto 24px; width: 80px; height: 80px; background-color: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 40px;">🔒</span>
                                    </div>
                                    <h1 style="color: #1f2937; font-size: 32px; font-weight: bold; margin: 24px 0;">Şifre Sıfırlama</h1>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px; text-align: left;">
                                        Merhaba <strong>{username}</strong>,
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px; text-align: left;">
                                        Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- CTA Button -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center;">
                                    <a href="{reset_url}" style="background-color: #dc2626; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; display: inline-block;">
                                        Şifremi Sıfırla
                                    </a>
                                </td>
                            </tr>
                            
                            <!-- Warning -->
                            <tr>
                                <td style="padding: 0 48px;">
                                    <div style="padding: 16px; background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
                                        <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 0;">
                                            ⚠️ <strong>Önemli:</strong> Bu link 1 saat içinde geçerliliğini yitirecektir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Alternative Link -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center;">
                                    <p style="color: #6b7280; font-size: 12px; line-height: 16px; margin-bottom: 8px;">
                                        Buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayın:
                                    </p>
                                    <p style="color: #dc2626; font-size: 12px; line-height: 16px; word-break: break-all;">
                                        {reset_url}
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px; margin-bottom: 16px;">
                                        Güvenlik nedeniyle, şifrenizi asla kimseyle paylaşmayın.
                                    </p>
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px;">
                                        © 2026 ExVitrin. Tüm hakları saklıdır.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, html)
    
    def send_message_notification_email(
        self,
        user_email: str,
        username: str,
        sender_name: str,
        message_preview: str,
        conversation_url: str
    ) -> Dict[str, Any]:
        """
        Send notification when user receives a new message
        """
        subject = f"Yeni Mesajınız Var - {sender_name}"
        
        # Truncate message preview
        if len(message_preview) > 100:
            message_preview = message_preview[:100] + "..."
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                            <tr>
                                <td style="padding: 32px 20px; text-align: center;">
                                    <h1 style="color: #dc2626; font-size: 32px; margin: 0;">ExVitrin</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 48px; text-align: center;">
                                    <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 40px 0;">💬 Yeni Mesajınız Var</h1>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        Merhaba <strong>{username}</strong>,
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
                                        <strong>{sender_name}</strong> size bir mesaj gönderdi:
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 48px 32px;">
                                    <div style="background-color: #f9fafb; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px;">
                                        <p style="color: #4b5563; font-size: 14px; line-height: 20px; margin: 0; font-style: italic;">
                                            "{message_preview}"
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 48px 32px; text-align: center;">
                                    <a href="{conversation_url}" style="background-color: #dc2626; border-radius: 8px; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; display: inline-block;">
                                        Mesajı Görüntüle
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 32px 48px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; font-size: 12px; line-height: 16px;">
                                        © 2026 ExVitrin. Tüm hakları saklıdır.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        return self._send_email(user_email, subject, html)


# Singleton instance
email_service = EmailService()
