#!/usr/bin/env python3
"""
Script to add sample listings for all Haus & Garten subcategories
"""
import requests
import json

API_URL = "http://localhost:8000/api/listings"

# Sample listings for each Haus & Garten subcategory
listings = [
    {
        "title": "Moderner Badezimmerschrank mit Spiegel - Weiß Hochglanz",
        "description": "Verkaufe einen hochwertigen Badezimmerschrank in Weiß Hochglanz. Der Schrank verfügt über einen integrierten Spiegel und bietet viel Stauraum. Maße: 80cm x 60cm x 15cm. Sehr guter Zustand, nur minimale Gebrauchsspuren. Ideal für moderne Badezimmer. Selbstabholung bevorzugt.",
        "price": 89.00,
        "category": "Haus & Garten",
        "subCategory": "Badezimmer",
        "condition": "Gebraucht",
        "priceType": "fixed",
        "city": "Berlin",
        "postalCode": "10115",
        "images": ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Schreibtisch Büro - Eiche massiv 140x70cm",
        "description": "Hochwertiger Schreibtisch aus massiver Eiche für Ihr Homeoffice oder Büro. Maße: 140cm x 70cm x 75cm. Der Tisch ist sehr stabil und bietet eine große Arbeitsfläche. Perfekt für produktives Arbeiten. Nur leichte Gebrauchsspuren, ansonsten in sehr gutem Zustand. Kann zerlegt werden für einfachen Transport.",
        "price": 245.00,
        "category": "Haus & Garten",
        "subCategory": "Büro",
        "condition": "Gebraucht",
        "priceType": "negotiable",
        "city": "München",
        "postalCode": "80331",
        "images": ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Wanddeko Set - 3 moderne Bilder mit Rahmen",
        "description": "Schönes Wanddeko-Set bestehend aus 3 modernen Bildern mit hochwertigen Rahmen. Perfekt für Wohnzimmer oder Schlafzimmer. Die Bilder zeigen abstrakte Motive in Grau- und Goldtönen. Rahmengröße jeweils: 40cm x 60cm. Neuwertig, da nur kurz aufgehängt. Verleihen Sie Ihrem Zuhause einen eleganten Touch!",
        "price": 45.00,
        "category": "Haus & Garten",
        "subCategory": "Dekoration",
        "condition": "Wie Neu",
        "priceType": "fixed",
        "city": "Hamburg",
        "postalCode": "20095",
        "images": ["https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Gartenpflege & Rasenmähen - Professioneller Service",
        "description": "Biete professionelle Gartenpflege und Rasenmähen an. Über 10 Jahre Erfahrung in der Gartenpflege. Leistungen umfassen: Rasenmähen, Heckenschneiden, Unkrautentfernung, Beetpflege und mehr. Zuverlässig, pünktlich und faire Preise. Regelmäßige Termine oder Einzeleinsätze möglich. Kostenlose Erstberatung! Kontaktieren Sie mich für ein unverbindliches Angebot.",
        "price": 35.00,
        "category": "Haus & Garten",
        "subCategory": "Dienstleistungen Haus & Garten",
        "condition": "Neu",
        "priceType": "negotiable",
        "city": "Köln",
        "postalCode": "50667",
        "images": ["https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Gartenschlauch Set 30m mit Sprühpistole & Halterung",
        "description": "Komplettes Gartenschlauch-Set mit 30 Meter langem Schlauch, Sprühpistole mit 7 Funktionen und Wandhalterung. Der Schlauch ist flexibel, knickfest und UV-beständig. Perfekt für die Gartenbewässerung. Die Sprühpistole bietet verschiedene Strahlarten von Nebel bis Vollstrahl. Neuwertig, nur einmal benutzt. Ideal für die kommende Gartensaison!",
        "price": 32.00,
        "category": "Haus & Garten",
        "subCategory": "Gartenzubehör & Pflanzen",
        "condition": "Wie Neu",
        "priceType": "fixed",
        "city": "Frankfurt",
        "postalCode": "60311",
        "images": ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Vorhänge Blickdicht 2er Set - Grau 140x245cm",
        "description": "Elegante blickdichte Vorhänge im 2er Set in der Farbe Grau. Maße pro Vorhang: 140cm x 245cm. Die Vorhänge sind aus hochwertigem Stoff gefertigt und verdunkeln den Raum sehr gut. Perfekt für Schlafzimmer oder Wohnzimmer. Mit Ösen für einfache Montage. Nur einmal gewaschen, wie neu. Schaffen Sie eine gemütliche Atmosphäre in Ihrem Zuhause!",
        "price": 38.00,
        "category": "Haus & Garten",
        "subCategory": "Heimtextilien",
        "condition": "Wie Neu",
        "priceType": "fixed",
        "city": "Stuttgart",
        "postalCode": "70173",
        "images": ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Bosch Akkuschrauber PSR 18V mit 2 Akkus & Koffer",
        "description": "Verkaufe meinen Bosch Akkuschrauber PSR 18V inkl. 2 Akkus, Ladegerät und praktischem Transportkoffer. Der Schrauber ist sehr leistungsstark und eignet sich perfekt für Heimwerker-Projekte. LED-Licht für bessere Sicht beim Arbeiten. Alle Teile funktionieren einwandfrei. Gebraucht aber in sehr gutem Zustand. Ideal für Renovierungen und Möbelmontage!",
        "price": 125.00,
        "category": "Haus & Garten",
        "subCategory": "Heimwerken",
        "condition": "Gebraucht",
        "priceType": "negotiable",
        "city": "Düsseldorf",
        "postalCode": "40210",
        "images": ["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Esstisch ausziehbar Eiche 160-200cm mit 6 Stühlen",
        "description": "Wunderschöner ausziehbarer Esstisch aus Eiche mit 6 passenden Stühlen. Tischmaße: 160cm ausziehbar auf 200cm, Breite 90cm. Die Stühle sind gepolstert und sehr bequem. Perfekt für Familien oder wenn Sie gerne Gäste empfangen. Der Tisch ist sehr stabil und hochwertig verarbeitet. Leichte Gebrauchsspuren, ansonsten top Zustand. Ein echter Hingucker für Ihre Küche oder Esszimmer!",
        "price": 450.00,
        "category": "Haus & Garten",
        "subCategory": "Küche & Esszimmer",
        "condition": "Gebraucht",
        "priceType": "negotiable",
        "city": "Leipzig",
        "postalCode": "04109",
        "images": ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Designer Stehlampe Modern - Schwarz/Gold 165cm",
        "description": "Moderne Designer-Stehlampe in Schwarz mit goldenen Akzenten. Höhe: 165cm. Die Lampe verfügt über einen Fußschalter und ist mit E27 Leuchtmitteln kompatibel. Perfekt für Wohnzimmer oder Leseecke. Sehr stilvolles Design, das jedem Raum das gewisse Etwas verleiht. Neuwertig, nur 3 Monate alt. Originalverpackung vorhanden. Ein absolutes Highlight für Ihr Zuhause!",
        "price": 78.00,
        "category": "Haus & Garten",
        "subCategory": "Lampen & Licht",
        "condition": "Wie Neu",
        "priceType": "fixed",
        "city": "Dortmund",
        "postalCode": "44135",
        "images": ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Boxspringbett 180x200cm Grau mit Matratze & Topper",
        "description": "Hochwertiges Boxspringbett in Grau, Größe 180x200cm. Inkl. Matratze und Topper für maximalen Schlafkomfort. Das Bett ist sehr bequem und bietet optimale Unterstützung. Bezug ist abnehmbar und waschbar. Nur 1 Jahr alt, daher noch in sehr gutem Zustand. Perfekt für erholsame Nächte. Muss zerlegt abgeholt werden. Ein Traum für Ihr Schlafzimmer!",
        "price": 650.00,
        "category": "Haus & Garten",
        "subCategory": "Schlafzimmer",
        "condition": "Gebraucht",
        "priceType": "negotiable",
        "city": "Essen",
        "postalCode": "45127",
        "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Sofa 3-Sitzer Samt Blau mit Kissen - Skandinavisch",
        "description": "Wunderschönes 3-Sitzer Sofa im skandinavischen Stil mit blauem Samtbezug. Maße: 210cm x 85cm x 80cm. Das Sofa ist sehr bequem und ein echter Hingucker. Inkl. 3 passenden Dekokissen. Die Füße sind aus hellem Holz. Perfekt für moderne Wohnzimmer. Nur 6 Monate alt, daher wie neu. Keine Flecken oder Beschädigungen. Verleihen Sie Ihrem Wohnzimmer einen stilvollen Look!",
        "price": 520.00,
        "category": "Haus & Garten",
        "subCategory": "Wohnzimmer",
        "condition": "Wie Neu",
        "priceType": "fixed",
        "city": "Bremen",
        "postalCode": "28195",
        "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
        "listingType": "selling"
    },
    {
        "title": "Gartenbank Holz 150cm mit Auflagenbox - Akazie",
        "description": "Schöne Gartenbank aus Akazienholz mit integrierter Auflagenbox. Länge: 150cm. Die Bank bietet bequeme Sitzgelegenheit für 2-3 Personen und praktischen Stauraum unter der Sitzfläche. Wetterfest behandelt und sehr stabil. Perfekt für Garten, Terrasse oder Balkon. Leichte Gebrauchsspuren durch Witterung, aber noch in gutem Zustand. Genießen Sie entspannte Stunden im Freien!",
        "price": 95.00,
        "category": "Haus & Garten",
        "subCategory": "Weiteres Haus & Garten",
        "condition": "Gebraucht",
        "priceType": "negotiable",
        "city": "Dresden",
        "postalCode": "01067",
        "images": ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"],
        "listingType": "selling"
    }
]

def add_listings():
    """Add all sample listings to the backend"""
    print("Adding sample listings for Haus & Garten categories...")
    print("-" * 60)
    
    success_count = 0
    error_count = 0
    
    for listing in listings:
        try:
            response = requests.post(
                API_URL,
                json=listing,
                params={
                    "seller_id": "demo_user_haus_garten",
                    "seller_name": "Demo Verkäufer"
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✓ Added: {listing['subCategory']} - {listing['title'][:50]}...")
                success_count += 1
            else:
                print(f"✗ Failed: {listing['subCategory']} - Status {response.status_code}")
                error_count += 1
                
        except Exception as e:
            print(f"✗ Error adding {listing['subCategory']}: {str(e)}")
            error_count += 1
    
    print("-" * 60)
    print(f"Summary: {success_count} successful, {error_count} failed")
    print(f"Total listings added: {success_count}/12")

if __name__ == "__main__":
    add_listings()
