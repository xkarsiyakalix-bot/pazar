"""
Test script for ExVitrin Email Service
Run this to test email sending functionality
"""

from email_service import email_service
import os
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# IMPORTANT: Change this to YOUR email address (the one you used to sign up for Resend)
TEST_EMAIL = "kerem_aydin@aol.com"

def test_welcome_email():
    """Test welcome email"""
    print("🧪 Testing Welcome Email...")
    
    result = email_service.send_welcome_email(
        user_email=TEST_EMAIL,
        username="Test Kullanıcı"
    )
    
    if result['success']:
        print("✅ Welcome email sent successfully!")
        print(f"📧 Email ID: {result.get('data', {}).get('id', 'N/A')}")
    else:
        print(f"❌ Failed to send welcome email: {result['error']}")
    
    return result

def test_listing_published_email():
    """Test listing published email"""
    print("\n🧪 Testing Listing Published Email...")
    
    result = email_service.send_listing_published_email(
        user_email=TEST_EMAIL,
        username="Test Kullanıcı",
        listing_title="2018 BMW 3 Serisi 320i",
        listing_url="http://localhost:3000/product/test-123",
        listing_image="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
        price="450.000",
        category="Otomobiller"
    )
    
    if result['success']:
        print("✅ Listing published email sent successfully!")
        print(f"📧 Email ID: {result.get('data', {}).get('id', 'N/A')}")
    else:
        print(f"❌ Failed to send listing email: {result['error']}")
    
    return result

def test_password_reset_email():
    """Test password reset email"""
    print("\n🧪 Testing Password Reset Email...")
    
    result = email_service.send_password_reset_email(
        user_email=TEST_EMAIL,
        username="Test Kullanıcı",
        reset_token="test_token_12345"
    )
    
    if result['success']:
        print("✅ Password reset email sent successfully!")
        print(f"📧 Email ID: {result.get('data', {}).get('id', 'N/A')}")
    else:
        print(f"❌ Failed to send password reset email: {result['error']}")
    
    return result

def test_message_notification_email():
    """Test message notification email"""
    print("\n🧪 Testing Message Notification Email...")
    
    result = email_service.send_message_notification_email(
        user_email=TEST_EMAIL,
        username="Test Kullanıcı",
        sender_name="Ahmet Yılmaz",
        message_preview="Merhaba, ürününüz hala satılık mı? Fiyat konusunda pazarlık yapabilir miyiz?",
        conversation_url="http://localhost:3000/messages/test-456"
    )
    
    if result['success']:
        print("✅ Message notification email sent successfully!")
        print(f"📧 Email ID: {result.get('data', {}).get('id', 'N/A')}")
    else:
        print(f"❌ Failed to send message notification: {result['error']}")
    
    return result

def main():
    """Run all email tests"""
    print("=" * 60)
    print("🚀 ExVitrin Email Service Test Suite")
    print("=" * 60)
    
    # Check if API key is set
    api_key = os.getenv('RESEND_API_KEY')
    if not api_key or api_key == 'your_resend_api_key_here':
        print("\n❌ ERROR: RESEND_API_KEY not set in .env file")
        print("Please add your Resend API key to app/backend/.env")
        print("\nExample:")
        print("RESEND_API_KEY=re_your_actual_key_here")
        return
    
    print(f"\n✅ API Key found: {api_key[:10]}...")
    print(f"📍 Frontend URL: {os.getenv('FRONTEND_URL', 'Not set')}")
    print("\n" + "=" * 60)
    
    # Run tests
    results = []
    
    # Test 1: Welcome Email
    results.append(("Welcome Email", test_welcome_email()))
    time.sleep(1)  # Avoid rate limiting
    
    # Test 2: Listing Published Email
    results.append(("Listing Published", test_listing_published_email()))
    time.sleep(1)  # Avoid rate limiting
    
    # Test 3: Password Reset Email
    results.append(("Password Reset", test_password_reset_email()))
    time.sleep(1)  # Avoid rate limiting
    
    # Test 4: Message Notification Email
    results.append(("Message Notification", test_message_notification_email()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    success_count = sum(1 for _, result in results if result.get('success'))
    total_count = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result.get('success') else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n🎯 Results: {success_count}/{total_count} tests passed")
    
    if success_count == total_count:
        print("\n🎉 All tests passed! Email service is working correctly.")
        print(f"\n📧 Check your inbox ({TEST_EMAIL}) for the test emails.")
        print("💡 Don't forget to check spam folder if you don't see them.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        print("\n🔍 Common issues:")
        print("   - Invalid API key")
        print("   - Domain not verified (can only send to your own email)")
        print("   - Network connection issues")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
