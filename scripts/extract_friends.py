#!/usr/bin/env python3
"""
Extract friend data from Facebook PDF export.
Parses names, birthdays, and ages from PDF text.
"""

import re
import json
import subprocess
from pathlib import Path
from datetime import datetime

def extract_friends_from_pdf(pdf_path):
    """Extract friend data from Facebook birthday events PDF."""
    
    # Convert PDF to text
    result = subprocess.run(
        ['pdftotext', str(pdf_path), '-'],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error converting PDF: {result.stderr}")
        return []
    
    text = result.stdout
    friends = []
    
    # Pattern to find birthday greetings: "Happy Birthday, Name! emoji"
    birthday_pattern = re.compile(r'Happy Birthday,\s+([^!]+)!')
    
    # Pattern for full dates: "November 28, 1985"
    full_date_pattern = re.compile(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})')
    
    # Pattern for partial dates: "November 28" (without year)
    partial_date_pattern = re.compile(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})(?!\s*,\s*\d{4})')
    
    # Pattern for age: "40 years old"
    age_pattern = re.compile(r'(\d{1,3})\s+years old')
    
    # Split into lines for parsing
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Check for birthday greeting
        birthday_match = birthday_pattern.search(line)
        if birthday_match:
            name = birthday_match.group(1).strip()
            
            # Look ahead for birthday date and age in next 15 lines
            birthday_date = None
            age = None
            birth_year = None
            
            for j in range(i, min(i + 15, len(lines))):
                future_line = lines[j].strip()
                
                # Look for full date first
                if not birthday_date:
                    full_date_match = full_date_pattern.search(future_line)
                    if full_date_match:
                        month = full_date_match.group(1)
                        day = full_date_match.group(2)
                        year = full_date_match.group(3)
                        birthday_date = f"{month} {day}, {year}"
                        birth_year = int(year)
                        continue
                
                # Look for partial date if no full date found
                if not birthday_date:
                    partial_date_match = partial_date_pattern.search(future_line)
                    if partial_date_match:
                        month = partial_date_match.group(1)
                        day = partial_date_match.group(2)
                        birthday_date = f"{month} {day}"
                
                # Look for age
                if not age:
                    age_match = age_pattern.search(future_line)
                    if age_match:
                        age = int(age_match.group(1))
                        # Calculate birth year from age if we don't have it
                        if not birth_year:
                            current_year = datetime.now().year
                            birth_year = current_year - age
            
            # Skip if we already have this friend (duplicate greeting)
            if any(f['name'] == name for f in friends):
                continue
            
            friend_data = {
                'name': name,
                'birthday': birthday_date,
                'age': age,
                'birth_year': birth_year,
                'source': 'facebook'
            }
            
            friends.append(friend_data)
            age_str = f"{age} years" if age else "?"
            print(f"  ✓ {name}: {birthday_date or 'No date'} (Age: {age_str})")
    
    return friends

def main():
    """Main extraction function."""
    
    base_dir = Path(__file__).parent.parent
    pdf_file = base_dir / "(8) Events _ Facebook.pdf"
    
    if not pdf_file.exists():
        print(f"❌ Error: PDF file not found at {pdf_file}")
        return
    
    print(f"📄 Extracting friends from: {pdf_file.name}")
    print("=" * 70)
    
    friends = extract_friends_from_pdf(pdf_file)
    
    print("=" * 70)
    print(f"\n📊 Total friends extracted: {len(friends)}")
    
    # Sort by name
    friends_list = sorted(friends, key=lambda x: x['name'])
    
    # Save to JSON
    output_file = base_dir / "friends_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(friends_list, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Saved to: {output_file.name}")
    
    # Print summary statistics
    friends_with_full_date = sum(1 for f in friends_list if f.get('birthday') and ',' in str(f.get('birthday', '')))
    friends_with_partial_date = sum(1 for f in friends_list if f.get('birthday') and ',' not in str(f.get('birthday', '')))
    friends_with_age = sum(1 for f in friends_list if f.get('age'))
    friends_with_year = sum(1 for f in friends_list if f.get('birth_year'))
    
    print("\n📈 Summary:")
    print(f"  • Friends with full birthday (month/day/year): {friends_with_full_date}")
    print(f"  • Friends with partial birthday (month/day only): {friends_with_partial_date}")
    print(f"  • Friends with age information: {friends_with_age}")
    print(f"  • Friends with calculated birth year: {friends_with_year}")
    print(f"  • Friends with no birthday info: {len(friends_list) - friends_with_full_date - friends_with_partial_date}")
    
    # Show first 10 examples
    if friends_list:
        print("\n🔍 Sample data (first 10 friends):")
        for friend in friends_list[:10]:
            bday = friend.get('birthday', 'No date')
            age = friend.get('age', '?')
            print(f"  • {friend['name']}: {bday} (Age: {age})")
    
    print("\n✅ Extraction complete!")
    print(f"\n💡 Next steps:")
    print(f"  1. Review friends_data.json")
    print(f"  2. You can manually add more friends or edit the data")
    print(f"  3. This data will be imported into the database during setup")

if __name__ == "__main__":
    main()
