#!/usr/bin/env python3
import json
from pathlib import Path

print("\n" + "="*70)
print("🔀 JSON Karşılaştırma ve Temizleme")
print("="*70 + "\n")

# tez.json oku
print("📖 tez.json okunuyor...")
with open('tez.json', 'r', encoding='utf-8') as f:
    data1 = json.load(f)
print(f"   ✅ {len(data1):,} tez okundu")

# tez2.json oku
print("📖 tez2.json okunuyor...")
with open('tez2.json', 'r', encoding='utf-8') as f:
    data2 = json.load(f)
print(f"   ✅ {len(data2):,} tez okundu\n")

# tez.json'daki Tez No'ları topla
print("🔍 Karşılaştırılıyor...")
tez_no_set = {t.get('Tez No', '') for t in data1 if t.get('Tez No', '')}
print(f"   ✅ tez.json: {len(tez_no_set):,} benzersiz Tez No")

# tez2.json'dan tez.json'dekileri çıkar
unique = []
removed = []
for t in data2:
    tez_no = t.get('Tez No', '')
    if tez_no not in tez_no_set:
        unique.append(t)
    else:
        removed.append(tez_no)

print("\n" + "="*70)
print("📊 SONUÇ")
print("="*70)
print(f"tez.json: {len(data1):,} tez")
print(f"tez2.json (Orijinal): {len(data2):,} tez")
print(f"tez2.json (Temizlenmiş): {len(unique):,} tez")
print(f"Çıkarılan: {len(removed):,} tez\n")

if removed:
    print(f"🔍 İlk {min(5, len(removed))} çıkarılan Tez No:")
    for i, no in enumerate(removed[:5], 1):
        print(f"   {i}. {no}")
    print()

# Backup
print("💾 Backup: tez2_backup.json")
with open('tez2_backup.json', 'w', encoding='utf-8') as f:
    json.dump(data2, f, ensure_ascii=False, indent=2)

# Temiz dosya
print("💾 Temizlenmiş: tez2_unique.json")
with open('tez2_unique.json', 'w', encoding='utf-8') as f:
    json.dump(unique, f, ensure_ascii=False, indent=2)

print("\n" + "="*70)
print("✨ TAMAMLANDI!")
print("="*70)
print(f"✅ tez.json: {len(data1):,} tez (değişmedi)")
print(f"✅ tez2_unique.json: {len(unique):,} tez (temizlenmiş)")
print(f"❌ Çıkarılan: {len(removed):,} tez")
print("\n💡 Memnun kaldıysanız:")
print("   mv tez2_unique.json tez2.json\n")
