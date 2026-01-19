import json
from pathlib import Path
import sys

def clean_json_file(filename):
    print(f"\n{'='*60}")
    print(f"🧹 {filename} temizleniyor...")
    print(f"{'='*60}\n")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📖 Okundu: {len(data):,} tez")
        
        seen = set()
        unique = []
        duplicates = 0
        
        for thesis in data:
            tez_no = thesis.get('Tez No', '')
            if tez_no and tez_no not in seen:
                seen.add(tez_no)
                unique.append(thesis)
            else:
                duplicates += 1
        
        print(f"✅ Benzersiz: {len(unique):,} tez")
        print(f"❌ Tekrar: {duplicates:,} tez")
        
        if duplicates == 0:
            print(f"\n✨ Harika! Hiç tekrar yok.")
            return
        
        path = Path(filename)
        backup_file = path.parent / f"{path.stem}_backup{path.suffix}"
        clean_file = path.parent / f"{path.stem}_clean{path.suffix}"
        
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"💾 Backup: {backup_file.name}")
        
        with open(clean_file, 'w', encoding='utf-8') as f:
            json.dump(unique, f, ensure_ascii=False, indent=2)
        print(f"💾 Temiz: {clean_file.name}")
        
        print(f"\n✨ Başarılı! {duplicates:,} tekrar silindi.")
        print(f"📊 Silme oranı: %{(duplicates/len(data)*100):.1f}")
        
    except FileNotFoundError:
        print(f"❌ '{filename}' bulunamadı!")
    except json.JSONDecodeError:
        print(f"❌ '{filename}' geçerli bir JSON değil!")
    except Exception as e:
        print(f"❌ Hata: {e}")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🧹 JSON Duplicate Temizleyici")
    print("="*60)
    
    files = sys.argv[1:] if len(sys.argv) > 1 else []
    
    if not files:
        for name in ['tez.json', 'tez2.json']:
            if Path(name).exists():
                files.append(name)
    
    if not files:
        print("\n❌ JSON dosyası bulunamadı!")
        print("\n💡 Kullanım: python clean_duplicates.py tez.json")
        sys.exit(1)
    
    for filename in files:
        clean_json_file(filename)
    
    print("\n" + "="*60)
    print("🎉 İşlem tamamlandı!")
    print("="*60 + "\n")
